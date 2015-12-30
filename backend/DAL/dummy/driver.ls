base = do
  get-user: (username, password, usepasswd, detail, newuser, callback) -> return callback null, {}
  session-store: -> do
    data: {}
    get: (sid, cb) ->
      cb @data[sid]
    set: (sid, session, cb) ->
      @data[sid] = session
      cb!
    destroy: (sid, cb) ->
      delete @data[sid]
      cb!
  init: (config, cb) -> cb!

module.exports = base
