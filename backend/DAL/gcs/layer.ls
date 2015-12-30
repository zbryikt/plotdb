
main = (driver) ->
  ds = driver.ds
  return store = do
    read: (prefix, key) -> new bluebird (res, rej) ->
      (e,t,n) <~ ds.runQuery (ds.createQuery([prefix]).filter("__key__ =", ds.key([prefix,id]))), _
      res if e or !t or !t.length => null else t.0.data

    write: (prefix, key, data) -> new bluebird (res, rej) ->
      for key of data => if !data[key]? => delete data[key]
      key = ds.key(if key => [prefix, key] else [prefix])
      (e,k) <- ds.save {key, data}
      if data.key => return res data
      data.key = key.1
      (e,k) <- ds.save {key, data}
      return res data

    delete: (prefix, key) -> new bluebird (res, rej) ->
      (e,t,n) <- ds.runQuery (ds.createQuery [prefix] .filter "__key__ =", ds.key([prefix,key])), _
      if e or !t or !t.length => return res!
      ds.delete key, (e,k) -> res if e => true else false

    list: (prefix, field, values) ->  new bluebird (res, rej) ->
      if field == \key =>
        (e,t,n) <- ds.get [ ds.key([prefix, key]) for key in values ]
      else
        #TODO - wait gcloud until they improve their gcloud binding
        if typeof(values) == typeof([]) and values.length => rej 'list by values doesnt supported'
        (e,t,n) <- ds.runQuery (ds.createQuery [prefix] .filter("#field =", values))
        res if e or !t or !t.length => null else t.0.data

module.exports = main
