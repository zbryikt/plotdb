require! <[pg bluebird crypto ./aux]>

pg.defaults.poolSize = 30

ret = (config) ->
  @config = config
  @authio = do
    user: do
      # store whole object ( no serialization )
      serialize: (user={}) -> bluebird.resolve( user or {} )
      deserialize: (v) ~> bluebird.resolve( v or {})

      # store only key
      #serialize: (user={}) -> bluebird.resolve( user.key or 0 )
      #deserialize: (v) ~>
      #  @query "select * from users where key = $1", [v]
      #    .then (r={}) -> r.[]rows.0

      get: (username, password, usepasswd, detail) ~>
        if !/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.[a-z]{2,}|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.exec(username) =>
          return aux.reject new Error("not email")
        pw = if usepasswd => crypto.createHash(\md5).update(password).digest(\hex) else ""
        user = {}
        @query "select * from users where username = $1", [username]
          .then (users = {}) ~>
            user = (users.[]rows.0)
            if !user => return @authio.user.create username, pw, usepasswd, detail
            if user and (usepasswd or user.usepasswd) and user.password != pw =>
              return bluebird.reject new Error('failed')
            return user
          .then (r = {}) ~>
            user := r
            @query "select team from teammembers where member = $1", [user.key]
          .then (r = {}) ~>
            user.teams = r.[]rows
            delete user.password
            return user
      create: (username, password, usepasswd, detail = {}) ~>
        displayname = if detail => detail.displayname or detail.username
        if !displayname => displayname = username.replace(/@.+$/, "")
        user = {username, password, usepasswd, displayname, detail, createdtime: new Date!}
        @query [
          "insert into users"
          "(username,password,usepasswd,displayname,createdtime,detail) values"
          "($1,$2,$3,$4,$5,$6) returning key"
        ].join(" "), [username, password, usepasswd, displayname, new Date!toUTCString!, detail]
          .then (r) ~>
            key = r.[]rows.0.key
            return user <<< {key}
          .catch ~>
            console.log "failed to create user"
            console.log it.stack
    session: do
      get: (sid, cb) ~>
        @query "select * from sessions where key=$1", [sid]
          .then ->
            cb null, (it.[]rows.0 or {}).detail
            return null
          .catch -> [console.error("session.get", it), cb it]
        return null
      set: (sid, session, cb) ~>
        @query([
          "insert into sessions (key,detail) values"
          "($1, $2) on conflict (key) do update set detail=$2"].join(" "), [sid, session])
          .then ->
            cb!
            return null
          .catch -> [console.error("session.set", it), cb!]
        return null
      destroy: (sid, cb) ~>
        @query "delete from sessions where key = $1", [sid]
          .then ->
            cb!
            return null
          .catch -> [console.error("session.destroy",it),cb!]
        return null
  @

ret.prototype = do
  query: (a,b=null,c=null) ->
    if typeof(a) == \string => [client,q,params] = [null,a,b]
    else => [client,q,params] = [a,b,c]
    _query = (client, q, params=null) -> new bluebird (res, rej) ->
      (e,r) <- client.query q, params, _
      if e => return rej e
      return res r
    if client => return _query client, q, params
    (res, rej) <~ new bluebird _
    (err, client, done) <~ pg.connect @config.io-pg.uri, _
    if err => return rej err
    _query client, q, params
      .then (r) -> [ done!, res r]
      .catch -> rej it
  aux: aux

module.exports = ret

