require! <[mongodb]>

OID = mongodb.ObjectID

base = do
  ds: null
  aux: {}
  cb: []
  initing: false
  init: ({mongodb: config, name: name}, cb) ->
    @cb.push cb
    if @initing => return
    @initing = true
    (e, db) <~ mongodb.MongoClient.connect "#{config.url}#{name}"
    if !db => 
      console.log "[ERROR] can't connect to mongodb server:"
      throw new Error e
    (e, user) <~ db.collection \user
    (e, session) <~ db.collection \session
    @ds = ds = {user, session}
    @db = db
    for cb in @cb => cb {ds, db}

  stream-writer: (res, stream) ->
    first = true
    res.write("[")
    stream.on \data, (it) ->
      if first == true => first := false
      else res.write(",")
      res.write(JSON.stringify it)
    stream.on \end, -> 
      res.write("]")
      res.send!

  get-user: (username, password, usepasswd, detail, newuser, callback) ->
    (e,user) <~ @ds.user.findOne {username: username}
    if !user =>
      user = newuser username, password, usepasswd, detail
      (e,r) <~ @ds.user.insertOne user, {w: 1}
      if e or !r or !r.insertedCount => return callback e, false, {message: "failed to create user"}
      user.key = r.insertedId
      (e,c,s) <~ @ds.user.update {_id: OID user.key}, {$set: {key: OID user.key}}, {w: 1}
      if e => return callback e, false, {message: "failed to create user"}
      delete user.password
      return callback null, user
    else
      if (usepasswd or user.usepasswd) and user.password != password => 
        return callback null, false, {message: if user.usepasswd => "incorrect email or password" else "did you login with facebook?"}
      delete user.password
      return callback null, user

  session-store: -> do
    get: (sid, cb) ~> 
      @ds.session.findOne {sid}, cb
    set: (sid, session, cb) ~> 
      delete session._id
      @ds.session.update {sid}, {$set: session}, {upsert: true, w:1}, cb
    destroy: (sid, cb) ~> @ds.session.remove {sid}, {w:1}, cb

module.exports = base
