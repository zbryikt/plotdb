require! <[../engine/aux bluebird]>
(engine,io) <- (->module.exports = it)  _

size-limits = engine.config.plan.size-limits
size-limit = (user) ->
  plan = user.{}payment.plan or 0
  if (engine.config.mode % 2) => return user.datasize > size-limits.2
  return (user.datasize > (size-limits[plan] or size-limits.0))

update-size = (req, user, delta) -> new bluebird (res, rej) ->
  [size,key] = [0, -1]
  if !user => return rej aux.error 403
  (if typeof(user) == typeof(0) =>
    io.query("select datasize,key from users where key = $1", [user])
  else bluebird.resolve({rows: [{datasize: user.datasize,key: user.key}]}))
    .then (r={}) ->
      user = r.[]rows.0
      if !user => return aux.reject null
      key := user.key
      size := ((user.datasize or 0) + delta) >? 0
      io.query "update users set datasize = $1 where users.key=$2", [size, key]
    .then ->
      io.query "select key,detail from sessions where (detail #>> '{passport,user,key}')::numeric = $1", [key]
    .then (r={})->
      ret = r.[]rows.0
      if !ret => return aux.reject null
      ret.{}detail.{}passport.{}user.datasize = size
      io.query "update sessions set (detail) = ($2) where key = $1", [ret.key, ret.detail]
    .then ->
      if !req.user or req.user.key != key => return res!
      req.user.datasize = size
      req.logIn req.user, -> res!
      return null
    .catch ->
      if !rej => return res!
      rej it
  /*
      io.query "select datasize from users where users.key = $1", [req.user.key or -1]
    .then (r) ->
      user = r.[]rows.0
      if !user => return rej aux.error 400
      datasize = ((user.datasize or 0) + delta) >? 0
      io.query "update users set datasize = $1 where users.key=$2", [datasize, req.user.key]
        .then ->
          req.login req.user, -> res!
          return null
  */


get-size = (queries) ->
  promises = for q in queries =>
    io.query(
      "select sum(octet_length(s.*::text)) as size from #{q.0} as s where s.#{q.1} = $1;"
      [q.2]
    )
  bluebird.all promises
    .then (r)-> 
      size = r.reduce(((a,b) -> 
        a + parseInt(b.[]rows{}[0].size or 0)
      ),0)
      return size or 0

{update-size, get-size, size-limit}
