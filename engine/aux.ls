base = do
  r500: (res, error) ->
    console.log "[ERROR] #error"
    res.status(500).json({detail:error})
  r404: (res, msg = "", as-page = false) ->
    if as-page => res.status(404).render 'module/404.jade', {msg: msg}
    else res.status(404)send msg
  r403: (res, msg = "", as-page = false) ->
    if as-page => res.status(403).render 'module/403.jade', {msg: msg}
    else res.status(403)send msg
  r400: (res, msg = "") -> res.status(400)send msg
  r200: (res) -> res.send!
  type:
    json: (req, res, next) ->
      res.set('Content-Type', 'application/json')
      next!

  authorized: (cb) -> (req, res) ->
    if not (req.user and req.user.isStaff) =>
      return res.status(403).render('403', {url: req.originalUrl})
    cb req, res

  needlogin: (cb) -> (req, res) ->
    if not (req.user) => return res.status(403).render('403', {url: req.originalUrl})
    cb req, res
  merge-config: (a,b) ->
    for k,v of b =>
      if a[k] and typeof(a[k]) == typeof({}) => base.merge-config(a[k], b[k])
      else => a[k] = b[k]
    a

module.exports = base
