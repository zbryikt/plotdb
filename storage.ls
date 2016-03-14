require! <[path fs gcloud bluebird]>


# NOTE
# gcloud-node doesn't bring predefinedAcl parameter
# ( check gcloud-node/lib/storage/index.js :
#   function Bucket.prototype.getWritableStream_, line 426, qs object
# )
# we need a patch that add "predefinedAcl: 'publicRead' in qs object
# it seems that gcloud already support this now.
# in this repo, this still have to be checked

base-driver = do
  local: (config) -> do
    write: (prefix, name, data) -> new bluebird (res, rej) ~>
      if !fs.exists-sync("./localstorage/#prefix") => @mkdir-recurse ".localstorage/#prefix"
      if !fs.statSync(".localstorage/#prefix")isDirectory! => rej!
      fs.write-file-sync ".localstorage/#prefix/#name", data
      res!
    path: (prefix, name) -> "#{config.storage.root}/#prefix/#name"
    mkdir-recurse: ->
      if !fs.exists-sync(it) => 
        @mkdir-recurse path.dirname it
        fs.mkdir-sync it

  gcs: (config) -> 
    gcloud := gcloud config.gcs
    storage = gcloud.storage!
    bucket = storage.bucket(config.storage.bucket)
    return do
      write: (prefix, name, data, type) -> new bluebird (res, rej) ~>
        ws = bucket.file("#prefix/#name").create-write-stream do
          metadata: {contentType: type,"Cache-Control":"public, max-age=8640000"}
        ws.on(\error, -> rej!).on(\complete, -> res!).write(data)
        ws.end!
      path: (prefix, name) -> "//#{config.storage.bucket}/#prefix/#name"

base = do
  init: (config) -> 
    base <<< base-driver[config.storage.type](config)

module.exports = base
