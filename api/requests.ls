require! <[fs fs-extra sanitize-html]>
require! <[../engine/aux ../engine/share/model/ ./thumb]>
(engine,io) <- (->module.exports = it)  _

requesttype = model.type.request

engine.router.api.get "/request/", (req, res) ->
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  paging = [<[$1 $2]>, [offset, limit]]
  io.query([
    "select users.displayname as ownername,requests.*,comments.content"
    "from requests,users,comments"
    "where users.key = requests.owner and comments.request = requests.key and comments.main = true"
    "offset $1 limit $2"
  ].join(" "), [offset, limit])
    .then (r={}) -> res.send r.rows
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.router.api.post "/request/", (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.name or !req.body.content => return aux.r400 res
  ret = {}
  content = sanitize-html req.body.content, do
    allowedTags: <[
      h2 h3 h4 h5 h6 ol code hr br b i p u em a ul li
      figure div blockquote strike strong img
    ]>
    allowedAttributes: do
      a: <[href]>
      img: <[src alt]>
      div: <[class]>
  io.query(
    "insert into requests (owner,name,config) values ($1,$2,$3) returning key",
    [req.user.key, req.body.name, req.body.config]
  )
    .then (r = {}) ->
      ret.request = r.[]rows.0.key
      io.query(
        "insert into comments (owner,content,request,main) values ($1,$2,$3,$4) returning key",
        [req.user.key, content, ret.request, true]
      )
    .then (r = {}) ->
      ret.comment = r.[]rows.0.key
      res.send ret
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.post "/comment/", (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.content => return aux.r400 res
  #TODO escape
  io.query "insert into comments (owner,content) values ($1,$2) returning key"
    .then (r = {}) ->
      key = r.[]rows.0.key
      res.send key
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.post "/comment/image", engine.multi.parser, (req, res) ->
  if !req.user => return aux.r403 res
  # TODO sanity check
  files = req.files.files
  ret = /\/(gif|jpg|jpeg|png)$/.exec(files.0.type)
  if !ret => return aux.r400 res
  io.query "insert into commentimgs (owner) values ($1) returning key", [req.user.key]
    .then (r) ->
      key = r.[]rows.0.key
      name = "#key.#{ret.1}"
      fs-extra.copy files.0.path, "static/s/comment/#name", (e) ->
        if e => return aux.r403 res
      res.send {files: [{url:"/s/comment/#name"}]}
      return null
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.delete "/comment/image", engine.multi.parser, (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.file => return aux.r400 res
  ret = /\/(\d+)\.(gif|jpg|jpeg|png)$/.exec(req.body.file)
  if !ret => return aux.r400 res
  key = ret.1
  name = "#key.#{ret.2}"
  io.query "select owner from commentimgs where key = $1", [key]
    .then (r={})->
      img = r.[]rows.0
      if !img => aux.r404 res
      if img.owner != req.user.key => return aux.r403 res
      fs-extra.remove "static/s/comment/#name", (e) ->
        if e => console.error "failed to remove commentimgs: #name"
        io.query "delete from commentimgs where key = $1", [key]
          .then -> res.send!
          .catch ->
            console.error it.stack
            aux.r403 res
      return null
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.get "/request/", (req, res) ->

engine.app.get "/request/:id/", aux.numid true, (req, res) ->
  ret = {}
  io.query "select requests.*,users.displayname as username, users.key as userkey from requests,users where requests.key = $1 and requests.owner = users.key", [req.params.id]
    .then (r = {}) -> 
      ret.request = r.[]rows.0
      io.query "select users.displayname as username, users.key as userkey,comments.* from comments,users where request = $1 and comments.owner = users.key", [req.params.id]
    .then (r = {}) ->
      ret.comments = r.rows
      res.render 'view/request/view.jade', ret
      return null
    .catch ->
      console.error it.stack
      aux.r403 res
