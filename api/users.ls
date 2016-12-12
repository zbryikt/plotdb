require! <[bluebird crypto fs fs-extra read-chunk image-type crypto]>
require! <[../engine/aux ../engine/share/model/ ../engine/throttle]>
require! <[./entity ./avatar ./mail]>
(engine,io) <- (->module.exports = it)  _

entity := entity engine, io
usertype = model.type.user
auth-limit = {strategy: \hard, limit: 10, upper-delta: 1800, json: true}
edit-limit = {strategy: \hard, limit: 30, upper-delta: 120, json: true}

get-user = (req, key) ->
  user = null
  io.query "select * from users where key = $1", [key]
    .then (r = {}) ->
      user := r.[]rows.0
      if !user => return bluebird.reject "user not found"
      io.query [
        "select ",
        "(select count(datasets.key) from datasets where owner = $1) as datasets,"
        "(select count(charts.key) from charts where owner = $1) as charts,"
        "(select count(themes.key) from themes where themes.owner = $1) as themes"
      ].join(" "), [user.key]
    .then (r = {}) ->
      stat = r.[]rows.0
      if !stat => return bluebird.reject "no user stat"
      user <<< {stat}

engine.router.api.get \/user/, entity.search 1

engine.app.get \/me/, throttle.limit {lower-delta: 2, upper-delta: 6, penalty: 1, limit: 6}, (req, res) ->
  if !req.user => return aux.r404 res, "", true
  get-user req, req.user.key
    .then (user) ->
      if !user => return aux.r404 res, "user not found", true
      res.render \view/me/profile.jade, {user}
      return null
    .catch -> return aux.r403 res, "", true

engine.app.get \/user/:id, aux.numid true, (req, res) ->
  get-user req, req.params.id
    .then (user) ->
      if !user => return aux.r404 res, "user not found", true
      res.render \view/me/profile.jade, {user}
      return null
    .catch -> return aux.r403 res, "", true

engine.app.get \/me/edit/, (req, res) ->
  if !req.user => return res.redirect "/"
  res.render \view/me/settings.jade, {user: req.user}

engine.router.api.post \/me/passwd/reset/:token, throttle.limit auth-limit, (req, res) ->
  token = req.params.token
  password = req.body.password
  io.query(
    "select users.key from users,pwresettoken where pwresettoken.token=$1 and users.key=pwresettoken.owner",
    [token]
  )
    .then (r={}) ->
      if !r.[]rows.length => return aux.reject 403
      user = r.rows.0
      user.password = (crypto.createHash(\md5).update(password).digest(\hex) or "")
      io.query "update users set (password,usepasswd) = ($2,$3) where key = $1", [user.key, user.password, true]
    .then -> io.query "delete from pwresettoken where pwresettoken.token=$1", [token]
    .then ->
      res.redirect \/auth/reset/done
      return null
    .catch aux.error-handler res, true

engine.app.get \/me/passwd/reset/:token, throttle.limit auth-limit, (req, res) ->
  token = req.params.token
  if !token => return aux.r400 res, "", true
  io.query "select owner,time from pwresettoken where token = $1", [token]
    .then (r={})->
      if !r.[]rows.length => return aux.reject 403, ""
      obj = r.rows.0
      if new Date!getTime! - new Date(obj.time).getTime! > 1000 * 600 =>
        res.redirect \/auth/reset/expire/
        return null
      res.redirect "/auth/reset/change/?token=#token"
      return null
    .catch aux.error-handler res, true

engine.router.api.post \/me/passwd/reset, throttle.limit auth-limit, (req, res) ->
  email = "#{req.body.email}".trim!
  if !email => return aux.r400 res, "did you provide you email?", true
  obj = {}
  io.query "select key from users where username = $1", [email]
    .then (r={}) ->
      if r.[]rows.length == 0 => return aux.reject 404
      time = new Date!
      obj <<< {key: r.rows.0.key, hex: "#{r.rows.0.key}" + (crypto.randomBytes(30).toString \hex), time: time }
      io.query "delete from pwresettoken where owner=$1", [obj.key]
    .then -> io.query "insert into pwresettoken (owner,token,time) values ($1,$2,$3)", [obj.key, obj.hex, obj.time]
    .then -> mail.reset-password email, obj.hex
    .then -> 
      res.redirect \/auth/reset/sent/
      return null
    .catch aux.error-handler res, true

engine.router.api.post \/me/passwd/, throttle.limit auth-limit,  (req, res) ->
  if !req.user => return aux.r404 res
  if !req.user.usepasswd => return aux.r400 res
  get-user req, req.user.key
    .then (user) ->
      {oldpasswd,newpasswd} = req.body{oldpasswd, newpasswd}
      if user.password != (crypto.createHash(\md5).update(oldpasswd).digest(\hex) or "") => return aux.r403 res
      user.password = (crypto.createHash(\md5).update(newpasswd).digest(\hex) or "")
      io.query "update users set password = $2 where key = $1", [req.user.key, user.password]
        .then ->
          req.login user, -> res.send!
          return null
        .catch -> aux.r500 res
      return null
    .catch (e) ->
      console.error e.stack
      aux.r404 res


engine.router.api.put \/user/:id, aux.numid false, throttle.limit edit-limit, (req, res) ->
  if !req.user or req.user.key != parseInt(req.params.id) => return aux.r403 res
  for key in <[username usepasswd password createdtime avatar]> => delete req.body[key]
  user = {} <<< req.user <<< req.body
  if (e = usertype.lint(user)).0 => return aux.r400 res, e
  usertype.clean(user)
  pairs = io.aux.insert.format usertype, user
  <[username usepasswd password avatar key createdtime]>.map -> delete pairs[it]
  pairs = io.aux.insert.assemble pairs
  io.query(
    "update users set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}",
    pairs.2 ++ [req.user.key]
  )
    .then (r={}) ->
      req.login user, -> res.send!
      return null
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.post(\/user/:id/avatar,
  engine.multi.parser, throttle.limit edit-limit, aux.numid false,
  (req, res) ->
    avatar-key = null
    avatar.upload(\user, +req.params.id)(req, res)
      .then ->
        avatar-key := it
        io.query "update users set (avatar) = ($1) where key = $2", [avatar-key,req.params.id]
      .then ->
        if req.user.key == +req.params.id =>
          req.user.avatar = avatar-key
          req.login req.user, -> res.send {avatar: avatar-key}
          return null
        else => res.send {avatar: avatar-key}
      .catch aux.error-handler res
)

engine.router.api.post(\/me/avatar,
  engine.multi.parser, throttle.limit edit-limit,
  (req, res) ->
    avatar-key = null
    if !req.user or !req.user.key => return aux.r403 res
    id = +req.user.key
    avatar.upload(\user, id)(req, res)
      .then ->
        avatar-key := it
        io.query "update users set (avatar) = ($1) where key = $2", [avatar-key,id]
      .then ->
        req.user.avatar = avatar-key
        req.login req.user, -> res.send {avatar: avatar-key}
        return null
      .catch aux.error-handler res
)
