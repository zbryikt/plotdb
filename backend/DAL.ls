require! <[bluebird]>

base = ((type, config={})->
  @driver = require "./DAL/#type/driver"
  @layer = require "./DAL/#type/layer"
  <~ @driver.init config
  @store = @layer @driver
  @
) <<< prototype: do
  read: (prefix, id) -> @store.read prefix, id
  write: (prefix, id, data) -> @store.write prefix, id, data
  delete: (prefix, id) -> @store.delete prefix, id
  list: (prefix, field, values) -> @store.list prefix, field, values

module.exports = base
