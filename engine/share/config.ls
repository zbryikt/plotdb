(->
  config = do
    #domain: \plotdb.com
    #domainIO: \plotdb.io
    domain: \localhost
    domainIO: \localhost.io
    urlschema: "http://"
    name: \plotdb
    debug: true
    facebook:
      clientID: \1546734828988373
    google:
      clientID: \608695485854-bh8mqncpi8ofl1pprl940gti2cdbhgf8.apps.googleusercontent.com

  if module? => module.exports = config
  else if angular? =>
    angular.module \plotDB
      ..service \plConfig <[]> ++ -> config
  else window.plConfig = config
)!
