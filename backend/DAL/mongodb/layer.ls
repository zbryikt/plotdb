require! <[mongodb bluebird]>

main = (driver) ->
  {db,ds} = driver{db,ds}
  col = {}

  OID = mongodb.ObjectID
  get-collection = (name, cb) -> 
    if !col[name] => return db.collection name, (e, ret) -> cb(col[name] = ret)
    else cb(col[name])

  return store = do
    read: (prefix, key) -> new bluebird (res, rej) -> get-collection prefix, (root) ->
      try
        root.findOne {_id: OID key}, (e,b) -> res b
      catch => res null
    write: (prefix, key, data) -> new bluebird (res, rej) -> get-collection prefix, (root) ->
      if key => 
        delete data.key
        delete data._id
        (e,r,b) <- root.update {_id: OID key},  {$set: data}, {upsert: true, w:1}
        if e or !r => return rej!
        data <<< {key, _id: key}
        return res data
      else 
        if data._id => delete data._id
        (e,r) <- root.insertOne data, {w:1}
        if e or !r or !r.insertedCount => return rej!
        data.key = r.insertedId
        (e,r,c) <- root.update {_id: OID data.key}, {$set: {key: OID data.key}}, {w: 1}
        if e or !r => return rej!
        return res data

    delete: (prefix, key) -> new bluebird (res, rej) ->  get-collection prefix, (root) ->
      root.deleteOne {_id: OID key}, {w:1} (e) -> res if e => true else false

    list: (prefix, field, values) -> new bluebird (res, rej) -> get-collection prefix, (root) ->
      query = {}
      if typeof(values) == typeof([]) and values.length =>
        try
          if field == 'key' => values := values.map(->OID it)
        catch e => console.log "mongodb store.list failed: ", e.toString!
        query[field] = { $in: values }
      else query[field] = values
      cursor = root.find(query).toArray (e,b) -> res b

module.exports = main
