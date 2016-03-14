require! <[fs crypto lwip read-chunk image-type bluebird ../backend/model ../storage ../lmodel ../backend/throttle]>
require! '../backend/main': {backend, aux}
store = null

auth-limit = {strategy: \hard, limit: 10, upper-delta: 1800, json: true}
edit-limit = {strategy: \hard, limit: 30, upper-delta: 120, json: true}
authkey-hash = do
  key: {}
  user: {}

module.exports = (backend, config) ->
  storage.init config
  router = backend.router
  store := model.driver.use config.driver
  lmodel := lmodel store

  get-user = (req, key) ->
    if req.user and req.user.key == key => new bluebird (res, rej) -> res req.user
    else store.read \user, key

  router.api.post \/me/passwd/, throttle.limit auth-limit,  (req, res) ->
    if !req.user.usepasswd => return aux.r400 res
    (cur-user) <- store.read \user, req.user.key .then
    {oldpasswd,newpasswd} = req.body{oldpasswd, newpasswd}
    if cur-user.password != (crypto.createHash(\md5).update(oldpasswd).digest(\hex) or "") => return aux.r403 res
    user = {} <<< cur-user
    user.password = (crypto.createHash(\md5).update(newpasswd).digest(\hex) or "")
    lmodel.user.clean user
    user.save!then (ret) -> req.login user, -> res.send!

  backend.app.get \/me/, throttle.limit {lower-delta: 2, upper-delta: 6, penalty: 1, limit: 6}, (req, res) ->
    if !req.user => return res.redirect "/"
    res.render \me/profile.jade, {user: req.user}

  backend.app.get \/me/edit/, (req, res) ->
    if !req.user => return res.redirect "/"
    res.render \me/settings.jade, {user: req.user}

  backend.app.post \/me/avatar, backend.multi.parser, throttle.limit edit-limit, (req, res) ->
    if !req.files.image => return aux.r400 res
    buf = read-chunk.sync req.files.image.path, 0, 12
    ret = image-type buf
    if !ret => return aux.r500 res, "not supported format"
    (e,img) <- lwip.open req.files.image.path, (ret.ext or '').toLowerCase!, _
    if e => return aux.r500 res, "not supported format"
    [w,h] = [img.width!, img.height!]
    [w1,h1] = if w > h => [w * 200 / h, 200] else [200, h * 200 / w]
    img = img.batch!resize(w1,h1).crop(200,200)
    (e,b) <- img.toBuffer \jpg
    if e => return r500 res, "failed to get img buffer"
    md5 = crypto.createHash \md5
    md5.update b
    md5 = md5.digest \hex
    (e) <- storage.write \avatar, "#md5.jpg", b .then
    user = {} <<< req.user <<< {avatar: storage.path(\avatar, "#md5.jpg")}
    lmodel.user.clean(user)
    user.save!then (ret) -> req.login user, -> res.send ret
    backend.multi.clean req, res

  backend.app.get \/user/:id, (req, res) ->
    (user) <- get-user req, req.params.id .then
    if !user => return aux.r404 res
    res.render \profile.jade, {user}

  router.api.put \/user/:id, throttle.limit edit-limit, (req, res) ->
    if !req.user or req.user.key != req.params.id => return aux.r403 res
    for key in <[username usepasswd password create_date avatar]> => delete req.body[key]
    user = {} <<< req.user <<< req.body
    if (e = lmodel.user.lint(user)).0 => return aux.r400 res, {msg: model.error-parser e}
    lmodel.user.clean(user)
    user.save!then (ret) -> req.login user, -> res.send ret

  router.api.get \/user/:id/summary, (req, res) ->
    if !req.params.id => return aux.r404 res
    (user) <- store.read \user, req.params.id .then
    res.json user{displayname, avatar,key}

