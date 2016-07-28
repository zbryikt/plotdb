require! <[bluebird]>
require! <[../engine/aux]>

(engine, io) <- (->module.exports = it) _

search = (default-type=0) -> (req, res) ->
  #TODO permission check
  type = default-type or +req.query.type or 3 # 1 - user, 2 - team, 3 - both
  keyword = (req.query.keyword or "")
  if !keyword and (type % 2) => return aux.r400 res
  [teams,users] = [[], []]
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  params = [offset, limit]
  params.push keyword if keyword
  fields = "key,displayname,avatar"
  bluebird.resolve!
    .then ->
      if (type .>>. 1) == 1 =>
        return io.query([
          "select count(key) from teams"
          "where name ~* $1" if keyword
        ].filter(->it).join(" "), (if keyword => [keyword] else []))
      else return bluebird.resolve {rows: [0]}
    .then (r={}) ->
      teamlen = (r.[]rows.{}0).count or 0
      if offset < teamlen and (type .>>. 1) == 1 =>
        return io.query([
          "select key,name as displayname,avatar from teams"
          "where name ~* $3" if keyword
          "offset $1 limit $2"
        ].filter(->it).join(" "), params)
      else return bluebird.resolve {}
    .then (r={}) ->
      teams := r.[]rows
      if teams.length < limit and (type % 2) == 1 =>
        params := [offset, limit - teams.length]
        params.push keyword if keyword
        return io.query([
          "select key,displayname,avatar from users"
          "where displayname ~* $3 or username ~* $3" if keyword
          "offset $1 limit $2"
        ].filter(->it).join(" "), params)
      else return bluebird.resolve {}
    .then (r={}) ->
      users := r.[]rows
      teams.map -> it.type = \team
      users.map -> it.type = \user
      res.send teams ++ users
      return null
    .catch aux.error-handler res

{search}
