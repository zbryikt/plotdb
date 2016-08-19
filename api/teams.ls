require! <[bluebird]>
require! <[../engine/aux ../engine/share/model/ ../engine/throttle]>
require! <[./entity ./avatar ./perm]>
(engine,io) <- (->module.exports = it)  _

entity := entity engine, io
teamtype = model.type.team
edit-limit = {strategy: \hard, limit: 30, upper-delta: 120, json: true}

engine.router.api.get \/entity/, entity.search!

update-user-teams = (req, res, uid) ->
  teams = []
  io.query "select team from teammembers where member = $1", [uid]
    .then (r={})->
      teams := r.[]rows.map(-> it.team)
      io.query "select key,detail from sessions where (detail #>> '{passport,user,key}')::numeric = $1", [uid]
    .then (r={})->
      ret = r.[]rows.0
      if !ret => return null
      ret.{}detail.{}passport.{}user.teams = teams
      io.query "update sessions set (detail) = ($2) where key = $1", [ret.key, ret.detail]
    .then ->
      new bluebird (res, rej) ->
        if !req.user => return res!
        if req.{}user.key == uid =>
          req.user.teams = teams
          req.logIn req.user, -> res!
        else => return res!

get-team = (req, res) ->
  payload = {}
  io.query(
    [
      'select teams.*,users.displayname as ownername,users.avatar as owneravatar'
      'from teams,users where teams.key=$1 and users.key=teams.owner'
    ].join(' '),
    [req.params.id]
  )
    .then (r={}) ->
      team = r.[]rows.0
      if !team => return aux.reject 404
      permtype = perm.caltype(req, team.{}permission, team.owner, \read)
      if !permtype.0 => return aux.reject 403
      payload.team = team
      payload.user-permission = permtype
      promises = []
      promises.push(
        io.query([
          'select users.key as key,users.username as username,'
          'users.displayname as displayname,users.avatar as avatar'
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
      if !perm.test(req, payload.team.{}permission, payload.team.owner, \admin) => delete payload.team.permission
      bluebird.resolve payload

engine.router.api.get \/team/, (req, res) ->
  if !req.query.detail => return entity.search(2) req, res
  keyword = (req.query.keyword or "")
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  params = [offset, limit]
  params.push keyword if keyword
  payload = {}
  bluebird.resolve!
    .then ->
      io.query """
        select teams.key as key,teams.name as displayname, teams.avatar as avatar,
        teams.description as description,count(teammembers.member)
        from teams,teammembers where #{if keyword => "teams.name ~* $3 and " else ""}
        teams.key=teammembers.team group by teams.key
        offset $1 limit $2
      """, params
    .then (r={})->
      payload.teams = teams = r.[]rows
      tids = teams.map(->it.key)
      io.query """
        select teamMember.*,users.avatar from users,(
        select member,team,row_number() over (partition by team order by member) as r
        from teammembers where team = any($1)
        ) teamMember where teamMember.r <= 10 and users.key = teamMember.member
      """, [tids]
    .then (r={}) ->
      payload.members = r.[]rows
      res.send payload
    .catch aux.error-handler res

engine.router.api.get "/team/:id", aux.numid false, (req, res) ->
  get-team req, res
    .then (payload={}) -> res.json payload
    .catch aux.error-handler res

batch-add-members = (req, res, tid, uids) ->
  if !Array.isArray(uids) or uids.length == 0 => return bluebird.resolve!
  io.query([
    "insert into teammembers (team,member) values"
    ["($1,$#i)" for i from 2 to uids.length + 1].join(",")
    "on conflict do nothing"
  ].join(" "), [tid] ++ uids)
    .then -> bluebird.all [update-user-teams req, res, uid for uid in uids]


batch-add-charts = (tid,cids) ->
  if !Array.isArray(cids) or cids.length == 0 => return bluebird.resolve!
  io.query([
    "insert into teamcharts (team,chart) values"
    ["($1,$#i)" for i from 2 to cids.length + 1].join(",")
    "on conflict do nothing"
  ].join(" "), [tid] ++ cids)

#TODO check user plan
engine.router.api.post \/team/, (req, res) ->
  [team,members] = [{},[]]
  bluebird.resolve!
    .then ->
      if !req.user => return aux.reject 403
      if typeof(req.body) != \object => return aux.reject 400
      team := req.body.team
      if !team => return aux.reject 400
      members := req.body.[]members
      if !Array.isArray(members) => members := []
      members := members.filter(-> typeof(it) == \number)
      team := team <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
      ret = teamtype.lint team
      if ret.0 => return aux.reject 400, ret
      team := teamtype.clean team
      pairs = io.aux.insert.format teamtype, team
      delete pairs.key
      pairs = io.aux.insert.assemble pairs
      io.query "insert into teams #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      team.key = (r.[]rows.0 or {}).key
      batch-add-members req, res, team.key, members
        .then -> res.send team
        .catch ->
          console.error aux.now-tag!, it.stack
          res.send team #TODO: hint user that some members were failed to be added
      return null
    .catch aux.error-handler res

team-permission = (req, res, level = \admin, fetch-all = false) ->
  <- Promise.resolve!then
  if !req.user => return aux.reject 403
  io.query "select #{if fetch-all => '*' else 'owner,permission'} from teams where key=$1", [req.params.tid]
    .then (r={})->
      team = r.[]rows.0
      if !team => return aux.reject 404
      if !perm.test(req, team.{}permission, team.owner, \admin) => return aux.reject 403
      bluebird.resolve team

engine.router.api.post(\/team/:tid/avatar,
  engine.multi.parser, throttle.limit edit-limit, aux.numid false,
  (req, res) ->
    avatar-key = null
    team-permission req, res, \admin
      .then (team) -> avatar.upload(\team, +req.params.id)(req, res)
      .then ->
        avatar-key := it
        io.query(
          "update teams set (avatar,modifiedtime) = ($2,$3) where key = $1",
          [req.params.id, avatar-key, new Date!]
        )
      .then -> res.send {avatar: avatar-key}
      .catch aux.error-handler res
)

engine.router.api.put \/team/:tid, (req, res) ->
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body
  id = parseInt(req.params.tid)
  if data.key != id => return aux.r400 res, [true, data.key, \key-mismatch]
  if !req.user => return aux.r403 res
  #io.query "select * from teams where key = $1", [id]
  #  .then (r = {}) ->
  team-permission req, res, \admin, all
    .then (team) ->
      #team = r.[]rows.0
      #if !team => return aux.reject 404
      #if !perm.test(req, team.{}permission, team.owner, \admin) => return aux.reject 403
      <[owner key createdtime]>.map -> delete data[it]
      team = team <<< data
      team.modifiedtime = new Date!
      ret = teamtype.lint(team)
      if ret.0 => return aux.reject 400, ret
      teamtype.clean(team)
      pairs = io.aux.insert.format teamtype, team
      <[owner key createdtime]>.map -> delete pairs[it]
      pairs = io.aux.insert.assemble pairs
      io.query(
        "update teams set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}"
        pairs.2 ++ [id]
      )
    .then (r={}) ->
      res.send {}
      return null
    .catch aux.error-handler res

engine.router.api.delete \/team/:tid, aux.numid false, (req, res) ->
  users = []
  team-permission req, res, \admin
    .then -> io.query "select member from teammembers where team=$1", [req.params.tid]
    .then (r={}) ->
      users = r.[]rows.map(->it.member)
      bluebird.all [
        "delete from teammembers where team=$1"
        "delete from teamcharts where team=$1"
        "delete from teamthemes where team=$1"
        "delete from teamdatasets where team=$1"
      ].map(-> io.query(it, [req.params.tid]))
    .then -> bluebird.all [update-user-teams(req, res, uid) for uid in users]
    .then -> io.query "delete from teams where key=$1", [req.params.tid]
    .then ->
      res.send {}
      return null
    .catch aux.error-handler res

#TODO length limit, according plan
engine.router.api.post \/team/:tid/member/, aux.numids false, <[tid]>, (req, res) ->
  team-permission req, res, \write
    .then ->
      if !Array.isArray(req.body) => return aux.reject 400
      members = req.body.map(->+it).filter(->it and !isNaN(it))
      batch-add-members req, res, req.params.tid, members
    .then -> res.send!
    .catch aux.error-handler res
#TODO length limit, according plan
engine.router.api.post \/team/:tid/chart/, aux.numids false, <[tid]>, (req, res) ->
  team-permission req, res, \write
    .then ->
      if !Array.isArray(req.body) => return aux.reject 400
      charts = req.body.map(->+it).filter(->it and !isNaN(it))
      batch-add-charts req.params.tid, charts
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.post \/team/:tid/member/:mid, aux.numids false, <[tid mid]>, (req, res) ->
  team-permission req, res, \write
    .then -> batch-add-members req, res, req.params.tid, [req.params.mid]
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.delete \/team/:tid/member/:mid, aux.numids false, <[tid mid]>, (req, res) ->
  team-permission req, res
    .then -> io.query "delete from teammembers where team=$1 and member=$2", [req.params.tid, req.params.mid]
    .then -> update-user-teams req, res, req.params.mid
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.post \/team/:tid/chart/:cid, aux.numids false, <[tid cid]>, (req, res) ->
  team-permission req, res, \write
    .then -> batch-add-charts req.params.tid, [req.params.cid]
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.delete \/team/:tid/chart/:cid, aux.numids false, <[tid cid]>, (req, res) ->
  team-permission req, res, \write
    .then -> io.query "delete from teamcharts where team=$1 and chart=$2", [req.params.tid, req.params.cid]
    .then -> res.send!
    .catch aux.error-handler res

engine.app.get \/team/:id, aux.numid true, (req, res) ->
  get-team req, res
    .then (payload={}) ->
      res.render 'view/team/index.jade', payload
      return null
    .catch aux.error-handler res, true
