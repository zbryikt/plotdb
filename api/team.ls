require! <[bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb]>
(engine,io) <- (->module.exports = it)  _

teamtype = model.type.team

get-team = (req, res) ->
  payload = {}
  io.query([ 'select * from teams where key=$1' ].join(" "), [req.params.id])
    .then (r={}) ->
      team = r.[]rows.0
      if !team => return aux.error 404
      if (team.{}permission.[]switch.indexOf(\public) < 0)
      and (!req.user or team.owner != req.user.key) => return aux.error 403
      payload.team = team
      promises = []
      promises.push(
        io.query([
          'select users.key as key,users.username as username,users.displayname as displayname'
          'from teamMembers,users'
          'where teamMembers.team=$1 and teamMembers.member=users.key'
        ].join(" "), [req.params.id])
          .then (r={}) ->
            payload.members = r.[]rows
            return null
      )
      promises.push(
        io.query([
          'select'
          [
            'charts.key as key'
            'charts.name as name'
            'charts.description as description'
            'charts.tags as tags'
          ].join(',')
          'from teamcharts,charts'
          'where teamcharts.team=$1 and teamcharts.chart=charts.key'
        ].join(" "),[req.params.id])
          .then (r={}) ->
            payload.charts = r.[]rows
            return null
      )
      #TODO show theme and datasets
      bluebird.all promises
    .then -> 
      bluebird.resolve payload

/*engine.app.get \/team/:id, aux.numid false, (req, res) ->
  get-team req, res
    .then (payload) -> 
      res.render 'view/team/index.jade', {payload}
      return null
    .catch aux.error-handler res, true
*/

engine.router.api.get \/team/, (req, res) ->
  #TODO permission check
  keyword = (req.query.keyword or "")
  detail = (req.query.detail or null)
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  params = [offset, limit, (req.user or {}).key]
  count = -> params.length + 1
  params.push keyword if keyword
  fields = if detail => "*" else "key,name"
  io.query([
    "select #fields from teams"
    "where name ~* $#{count!}" if keyword
    "offset $1 limit $2"
  ].filter(->it).join(" "), params)
    .then (r={})->
      res.send r.[]rows
    .catch aux.error-handler res

engine.router.api.get "/team/:id", aux.numid false, (req, res) ->
  get-team req, res
    .then (payload={}) -> res.json payload
    .catch aux.error-handler res

batch-add-members = (tid,uids) ->
  io.query([
    "insert into teammembers (team,member) values"
    ["($1,$#i)" for i from 2 to uids.length + 1].join(",")
    "on conflict do nothing"
  ].join(" "), [tid] ++ uids)

engine.router.api.post \/team/, (req, res) ->
  [team,members] = [{},[]]
  bluebird.resolve!
    .then ->
      if !req.user => return aux.error 403
      if typeof(req.body) != \object => return aux.error 400
      team := req.body.team
      if !team => return aux.error 400
      members := req.body.[]members
      team := team <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
      ret = teamtype.lint team
      if ret.0 => return aux.error 400, ret
      team := teamtype.clean team
      pairs = io.aux.insert.format teamtype, team
      delete pairs.key
      pairs = io.aux.insert.assemble pairs
      io.query "insert into teams #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      team.key = (r.[]rows.0 or {}).key
      batch-add-members team.key, members
        .then -> res.send team
        .catch -> 
          console.error aux.now-tag!, it.stack
          res.send team #TODO: hint user that some members were failed to be added
      return null
    .catch aux.error-handler res

engine.router.api.put \/team/:id, (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  id = parseInt(req.params.id)
  data = req.body
  if data.key != id => return aux.r400 res, [true, data.key, \key-mismatch]

  io.query "select * from teams where key = $1", [id]
    .then (r = {}) ->
      team = r.[]rows.0
      if !team => return aux.error 404
      if team.owner != req.user.key => return aux.error 403
      team = team <<< data
      ret = teamtype.lint(team)
      if ret.0 => return aux.error 400
      teamtype.clean(team)
      pairs = io.aux.insert.format teamtype, team
      <[owner key createdtime]>.map -> delete pairs[it]
      pairs = io.aux.insert.assemble pairs
      io.query(
        "update team set #{pairs.0} = #{paris.1} where key = $#{pairs.2.length + 1}"
        pairs.2 ++ [req.user.key]
      )
    .then (r={}) ->
      res.send {}
      return null
    .catch aux.error-handler res

engine.router.api.delete \/team/:id, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  io.query "select key from teams where key = $1", [req.params.id]
    .then (r={}) ->
      if !r.[]rows.0 => return aux.error 404
      if r.owner != req.user.key => return aux.error 403
      bluebird.all [
        "delete from teammembers where team=$1"
        "delete from teamcharts where team=$1"
        "delete from teamthemes where team=$1"
        "delete from teamdatasets where team=$1"
      ].map(-> io.query(it, [req.params.id]))
    .then (r={}) -> io.query "delete from teams where key=$1", [req.params.id]
    .then (r={}) ->
      res.send {}
      return null
    .catch aux.error-handler res

team-ownership = (req, res) ->
  <- Promise.resolve!then 
  if !req.user => return aux.error 403
  io.query "select owner from teams where key=$1", [req.params.tid]
    .then (r={})->
      team = r.[]rows.0
      if !team => return aux.error 404
      if !team.owner == req.user.key => return aux.error 403
      bluebird.resolve team

#TODO length limit
engine.router.api.post \/team/:tid/member/, aux.numids false, <[tid]>, (req, res) ->
  team-ownership req, res
    .then ->
      if !Array.isArray(req.body) => return aux.error 400
      members = req.body.map(->+it).filter(->it and !isNaN(it))
      batch-add-members req.params.tid, members
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.post \/team/:tid/member/:mid, aux.numids false, <[tid mid]>, (req, res) ->
  team-ownership req, res
    .then -> io.query "insert into teammembers values ($1,$2)", [req.params.tid, req.params.mid]
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.delete \/team/:tid/member/:mid, aux.numids false, <[tid mid]>, (req, res) ->
  team-ownership req, res
    .then -> io.query "delete from teammembers where team=$1 and member=$2", [req.params.tid, req.params.mid]
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.post \/team/:tid/chart/:cid, aux.numids false, <[tid cid]>, (req, res) ->
  team-ownership req, res
    .then -> io.query "insert into teamcharts values ($1,$2)", [req.params.tid, req.params.cid]
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.delete \/team/:tid/chart/:cid, aux.numids false, <[tid cid]>, (req, res) ->
  team-ownership req, res
    .then -> io.query "delete from teamcharts where team=$1 and chart=$2", [req.params.tid, req.params.cid]
    .then -> res.send!
    .catch aux.error-handler res

