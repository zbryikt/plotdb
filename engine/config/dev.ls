(->
  config = do
    domain: \dev.plotdb.com
    domainIO: \dev.plotdb.io
    urlschema: "https://"
    name: \plotdb
    debug: false
    facebook:
      clientID: \1546734828988373
    google:
      clientID: \1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com

  if module? => module.exports = config
  else if angular? =>
    angular.module \plotDB
      ..service \plConfig <[]> ++ -> config
  else window.plConfig = config
)!
