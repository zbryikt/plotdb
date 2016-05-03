require! <[bluebird crypto fs fs-extra lwip read-chunk image-type]>
require! <[../engine/aux ../engine/share/model/ ../engine/throttle]>
(engine, io) <- (->module.exports = it)  _

usertype = model.type.user
auth-limit = {strategy: \hard, limit: 10, upper-delta: 1800, json: true}
edit-limit = {strategy: \hard, limit: 30, upper-delta: 120, json: true}

# NOTE some fields in session data are removed, such as password. force query if necessary
get-user = (req, key, force = false) ->
  if !force and req.user and req.user.key == key => return new bluebird (res, rej) -> res req.user
  io.query "select * from users where key = $1", [key]
    .then (r) -> return r.[]rows.0

engine.app.get \/me/, throttle.limit {lower-delta: 2, upper-delta: 6, penalty: 1, limit: 6}, (req, res) ->
  if !req.user => return res.redirect "/"
  res.render \view/me/profile.jade, {user: req.user}

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

engine.router.api.post \/me/passwd/, throttle.limit auth-limit,  (req, res) ->
  if !req.user => return aux.r404 res
  if !req.user.usepasswd => return aux.r400 res
  get-user req, req.user.key, true
    .then (user) ->
      {oldpasswd,newpasswd} = req.body{oldpasswd, newpasswd}
      if user.password != (crypto.createHash(\md5).update(oldpasswd).digest(\hex) or "") => return aux.r403 res
      user.password = (crypto.createHash(\md5).update(newpasswd).digest(\hex) or "")
      io.query "update users set password = $1", [user.password]
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
  if (e = usertype.lint(user)).0 => return aux.r400 res
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

engine.app.post \/me/avatar, engine.multi.parser, throttle.limit edit-limit, (req, res) ->
  if !req.files.image => return aux.r400 res
  buf = read-chunk.sync req.files.image.path, 0, 12
  ret = image-type buf
  if !ret => return aux.r403 res, "not supported format"
  (e,img) <- lwip.open req.files.image.path, (ret.ext or '').toLowerCase!, _
  if e => return aux.r403 res, "not supported format"
  [w,h] = [img.width!, img.height!]
  [w1,h1] = if w > h => [w * 200 / h, 200] else [200, h * 200 / w]
  img = img.batch!resize(w1,h1).crop(200,200)
  (e,b) <- img.toBuffer \jpg
  if e =>
    console.error "failed (img.toBuffer)"
    return r500 res, "failed processing avatar. maybe try later?"
  md5 = crypto.createHash \md5
  md5.update b
  md5 = md5.digest \hex
  if /^[0-9a-fA-F]+$/.exec(req.user.avatar or "") =>
    fs-extra.remove "static/s/avatar/#{req.user.avatar}.jpg"
  fs-extra.mkdirs "static/s/avatar", ->
    fs.write-file "static/s/avatar/#{md5}.jpg", b, (e) ->
      if e => return aux.r500 res, "failed writing avatar. maybe try later?"
      io.query "update users set (avatar) = ($1) where key = $2", [md5, req.user.key]
        .then ->
          req.user.avatar = md5
          req.login req.user, -> res.send {avatar: md5}
          return null
        .catch ->
          console.error it.stack
          aux.r403 res
