require! <[bluebird]>
require! <[../engine/aux]>

(engine, io) <- (->module.exports = it) _

search = (default-type=0) -> (req, res) ->
  #TODO permission check
  type = default-type or +req.query.type or 3 # 1 - user, 2 - team, 3 - both
  keyword = (req.query.keyword or "")
  flags = {user: (type .&. 1), team: (type .&. 2), chart: (type .&. 4)}
  if !keyword => return aux.r400 res
  ret = {teams: [], users: [], charts: []}
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  clen = 0
  params = [offset, limit]
  params.push keyword if keyword
  fields = "key,displayname,avatar"
  bluebird.resolve!
    .then ->
      if flags.team =>
        return io.query([
          "select key,name as displayname,avatar from teams"
          "where name ~* $3" if keyword
          "offset $1 limit $2"
        ].filter(->it).join(" "),params)
      else return bluebird.resolve {}
    .then (r={}) ->
      if r.[]rows.length => ret.teams = r.[]rows
      clen := clen + r.[]rows.length
      if flags.user and clen < limit =>
        params.1 = limit - clen
        return io.query([
          "select key,displayname,avatar from users"
          "where displayname ~* $3 or username ~* $3" if keyword
          "offset $1 limit $2"
        ].filter(->it).join(" "),params)
      else return bluebird.resolve {}
    .then (r={}) ->
      if r.[]rows.length => ret.users = r.[]rows
      clen := clen + r.[]rows.length
      if flags.chart and clen < limit =>
        params.1 = limit - clen
        return io.query([
          "select charts.key,charts.name as displayname,users.displayname as ownername"
          "from charts,users where charts.owner = users.key"
          "and charts.name ~* $3" if keyword
          "offset $1 limit $2"
        ].filter(->it).join(" "),params)
      else return bluebird.resolve {}
    .then (r={}) ->
      if r.[]rows.length => ret.charts = r.[]rows
      ret.teams.map -> it.type = \team
      ret.users.map -> it.type = \user
      ret.charts.map -> it.type = \chart
      res.send ret.teams ++ ret.users ++ ret.charts
      return null
    .catch aux.error-handler res
{search}
