require! 'fs-extra': fs
require! <[path bluebird crypto]>

ret = ->
  @root = path.join process.cwd!, ".localfsdb"
  if !fs.exists-sync @root => fs.mkdirs-sync @root
  if !fs.lstat-sync(@root).isDirectory! => throw new Error "#{@root} should be a directory."
  @authio = do
    user: do
      get: (username, password, usepasswd, detail) ~> new bluebird (res, rej) ~>
        pw = if usepasswd => crypto.createHash(\md5).update(password).digest(\hex) else ""
        user = @query (-> it.username == username ), \user .0
        if !user =>
          user = @authio.user.create username, pw, usepasswd, detail
          @write null, user, \user
          @write user.key, user, \user
        else if (usepasswd or user.usepasswd) and user.password != pw => return rej!
        delete user.password
        return res user
      create: (username, password, usepasswd, detail) ->
        displayname = if detail => detail.displayname or detail.username
        if !displayname => displayname = username.replace(/@.+$/, "")
        user = {username, password, usepasswd, displayname, detail, create_date: new Date!}
    session: do
      get: (sid, cb) ~>
        ret = @read sid, \session
        cb null, ret
      set: (sid, session, cb) ~>
        @write(sid, session, \session)
        cb!
      destroy: (sid, cb) ~> cb @delete sid, \session
  @

ret.prototype = do
  init: -> new bluebird.resolve!
  full-key: (key, type=null) -> 
    path.join(@root, (type or ''), (new Buffer(key).toString(\base64).replace(/\//g, "-")))
  get-dir: (type=null) -> path.join(@root, type or '')
  exists: (key, type=null) -> return fs.exists-sync(@full-key(key,type))
  delete: (key, type=null) -> 
    if fs.exists-sync(@full-key(key,type)) => fs.unlink-sync @full-key(key,type)
  create-key: (prefix) -> 
    while 1 =>
      candidate = parseInt(Math.random!*4000000000).toString(36)
      if !@exists(prefix,candidate) => break
    @write candidate, {}, prefix
    return candidate
  read: (key, type=null) ->
    if !key => return null
    if !fs.exists-sync(@full-key(key,type)) => return null
    JSON.parse(fs.read-file-sync @full-key(key,type))
  write: (key, data, type=null) ->
    if !key => data.key = key = @create-key type
    if !fs.exists-sync(@get-dir(type)) => fs.mkdirsSync @get-dir(type)
    fs.write-file-sync(@full-key(key,type), JSON.stringify(data))
    data
  query: (criteria, type=null) ->
    dir = @get-dir(type)
    if !fs.exists-sync(dir) or !fs.stat-sync(dir)is-directory! => return []
    files = fs.readdir-sync(dir).map(-> "#dir/#it").filter(-> !fs.stat-sync(it)is-directory!)
    ret = []
    for file in files =>
      try 
        ret.push JSON.parse( fs.read-file-sync file .toString! )
      catch
    ret = ret.filter(->it).filter(criteria)
    return ret

module.exports = ret
