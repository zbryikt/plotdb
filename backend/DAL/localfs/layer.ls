require! <[bluebird]>
main = (driver) ->
  return store = do
    read: (prefix, key) -> new bluebird (res, rej) -> 
      res driver.db.read key, prefix
    write: (prefix, key, data) -> new bluebird (res, rej) -> 
      res driver.db.write key, data, prefix
    delete: (prefix, key) -> new bluebird (res, rej) -> res driver.db.delete key, prefix
    list: (prefix, field, values) ->
      tester = (obj) -> if values.indexOf(obj[field]) >= 0 => true else false
      new bluebird (res, rej) -> res driver.db.query tester, prefix
/*
    list: do
      by-user: (user, prefix, cb) -> 
        tester =  (obj) -> if obj.owner == user => true else false
        cb driver.db.query tester, prefix
      by-key: (keys, prefix, cb) -> cb(for id in keys => driver.db.read id, prefix)
    exists: (prefix, id) -> driver.db.exists id, prefix
    write: (prefix, id, json, cb) -> cb(driver.db.write id, json, prefix)
    read: (prefix, id, cb) -> cb(driver.db.read id, prefix)
    delete: (prefix, id, cb) -> cb(driver.db.delete id, prefix)
    fav: (prefix, id, user, cb) ->
      (data) <- store.read prefix, id, _
      if !data => return cb!
      (favhash={}) <- store.read "fav/#prefix", user.username, _
      isOn = if favhash[id] => true else false
      if isOn => delete favhash[id]
      else favhash[id] = 1
      <- store.write "fav/#prefix", user.username, favhash, _
      data.fav = (data.fav or 0) + (if isOn => -1 else 1)
      store.write prefix, id, data, -> cb !isOn
*/
/*
    key: (prefix) -> 
      while 1 =>
        candidate = parseInt(Math.random!*4000000000).toString(36)
        if !@exists(prefix,candidate) => break
      @write prefix, candidate, {}, ->
      return candidate
    palette: do
      lint: (payload) ->
        if !payload or !payload.name or !payload.[]colors.length => return false
        if payload.[]colors.filter(-> !it.hex or it.hex.length >10 or (it.semantic or "").length > 20).length => return false
        if payload.name.length > 20 or (payload.category or "").length > 20 => return false
        return true
      clean: (payload, req) ->
        cleandata = {colors: []} <<< payload{name, category}
        for item in payload.colors => cleandata.colors.push {} <<< item{hex, semantic}
        return cleandata
      create: (payload, req) ->
        cleandata = @clean payload, req
        cleandata.owner = req.user.username
        cleandata.key = store.key \palette
        return cleandata
    palettes: do
      lint: (payload) ->
        if !payload or !payload.name => return false
        if payload.[]palettes.filter(-> typeof(it) != typeof("") or it.length >= 20 ).length => return false
        return true
      clean: (payload, req) ->
        cleandata = {palettes: []} <<< payload{name}
        (palettes) <- store.list.by-key payload.[]palettes, \palette, _
        cleandata.palettes = palettes.filter(->!it.deleted).map(-> it.key)
        return cleandata
      expand: (payload) ->
        if !payload.palettes.length or payload.palettes.0.colors => return
        (palettes) <- store.list.by-key payload.[]palettes, \palette, _
        payload.palettes = palettes.filter(->!it.deleted)
      create: (payload, req) ->
        cleandata = @clean payload, req
        cleandata.owner = req.user.username
        cleandata.key = store.key \palettes
        return cleandata
*/

module.exports = main
