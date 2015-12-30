require! <[fs path]>

mkdir-recurse = (f) ->
  if fs.exists-sync f => return
  parent = path.dirname(f)
  if !fs.exists-sync parent => mkdir-recurse parent
  fs.mkdir-sync f

base = do
  ds: null
  aux: {}

  init: (config, cb) ->
    @root = path.join process.cwd!, ".localfsdb"
    if !fs.exists-sync @root => fs.mkdir-sync @root
    if !fs.lstat-sync(@root).isDirectory! => throw new Error "#{@root} should be a directory."
    @db = db = do
      full-key: (key, type=null) ~> path.join(@root, (type or ''), (new Buffer(key).toString(\base64).replace(/\//g, "-")))
      get-dir: (type=null) ~> path.join(@root, type or '')
      exists: (key, type=null) -> return fs.exists-sync(@full-key(key,type))
      delete: (key, type=null) -> if fs.exists-sync(@full-key(key,type)) => fs.unlink-sync @full-key(key,type)
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
        if !fs.exists-sync(@get-dir(type)) => mkdir-recurse(@get-dir(type))
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
    cb {db}

  get-user: (username, password, usepasswd, detail, newuser, callback) ->
    user = @db.query (-> it.username == username ), \user .0
    if !user =>
      user = newuser username, password, usepasswd, detail
      @db.write null, user, \user
      @db.write user.key, user, \user
    else
      if (usepasswd or user.usepasswd) and user.password != password => 
        return callback null, false, {message: if user.usepasswd => "incorrect email or password" else "did you login with facebook?"}
    delete user.password
    return callback null, user

  session-store: -> do
    get: (sid, cb) ~>
      ret = @db.read sid, \session
      cb null, ret
    set: (sid, session, cb) ~> 
      @db.write(sid, session, \session)
      cb!
    destroy: (sid, cb) ~> cb @db.delete sid, \session

module.exports = base
