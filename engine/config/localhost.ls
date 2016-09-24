(->
  config = do
    domain: \localhost
    domainIO: \localhost.io
    urlschema: "http://"
    name: \plotdb
    debug: true
    facebook:
      clientID: \1546734828988373
    google:
      clientID: \1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com
    mode: 1 # 0x01 - all user all pro features
    plan:
      size-limits: [1000000, 50000000, 1000000000]

  if module? => module.exports = config
  else if angular? =>
    try
      angular.module \plotDB
        ..service \plConfig <[]> ++ -> config
    catch e
  if window? => window.plConfig = config
)!
