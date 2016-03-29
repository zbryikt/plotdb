require! <[pg bluebird crypto ./aux]>

ret = (config) ->
  @config = config
  @authio = do
    user: do
      get: (username, password, usepasswd, detail) ~>
        pw = if usepasswd => crypto.createHash(\md5).update(password).digest(\hex) else ""
        @query "select * from users where username = '#username'"
          .then (users = {}) ~>
            user = (users.[]rows.0)
            if !user => return @authio.user.create username, pw, usepasswd, detail
            if user and (usepasswd or user.usepasswd) and user.password != pw => return Promise.reject!
            return user
          .then (user) ~>
            delete user.password
            return user
      create: (username, password, usepasswd, detail = {}) ~>
        displayname = if detail => detail.displayname or detail.username
        if !displayname => displayname = username.replace(/@.+$/, "")
        user = {username, password, usepasswd, displayname, detail, createdTime: new Date!}
        @query [
          "insert into users"
          "(username,password,usepasswd,displayname,createdtime,detail) values"
          "('#username','#password',#usepasswd,'#displayname','#{new Date!}',$1)"
        ].join(" "), [detail] .then ~> return user
    session: do
      get: (sid, cb) ~>
        @query "select * from sessions where key=$1", [sid]
          .then -> 
            cb null, (it.[]rows.0 or {}).detail
          .catch -> [console.error("session.get", it), cb it]
      set: (sid, session, cb) ~>
        @query([
          "insert into sessions (key,detail) values"
          "('#sid', $1) on conflict (key) do update set detail=$1"].join(" "), [session])
          .then -> cb!
          .catch -> [console.error("session.set", it), cb!]
      destroy: (sid, cb) ~>
        @query "delete from sessions where key = '#sid'"
          .then -> cb!
          .catch -> [console.error("session.destroy",it),cb!]
  @

ret.prototype = do
  query: (a,b=null,c=null) -> 
    if typeof(a) == \string => [client,q,params] = [null,a,b]
    else => [client,q,params] = [a,b,c]
    _query = (client, q, params=null) -> new Promise (res, rej) ->
      (e,r) <- client.query q, params, _
      if e => return rej e
      return res r
    if client => return _query client, q, params
    (res, rej) <~ new Promise _
    (err, client, done) <~ pg.connect @config.io-pg.uri, _
    if err => return rej err
    _query client, q, params
      .then (r) -> [ done!, res r]
      .catch -> rej it
  aux: aux

module.exports = ret

