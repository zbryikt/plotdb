# database cache
cache = (driver, schema, name, uid) -> do
  data: {}
  init: -> 
    @data = driver.cache.init name
  create: (k,d) -> 
    if schema(d) => return [true, that]
    ret = driver.cache.create name, k, d
    [false, @data[uid(k)] = ret]
  retrieve: (k) ->
    if @data[uid(k)] == null => return null
    ret = driver.cache.retrieve name, k
    if !ret => @data[uid(k)] = null
    ret
  update: (k,d) ->
    if schema(d,true) => return [true,that]
    ret = driver.cache.update name, d
    [false, @data[uid(k)] = ret]
  delete: (k) ->
    driver.cache.delete name, k
    @data[uid(k)] = null

# TODO implement following, in each backend driver

driver.cache.update
driver.cache.delete
driver.cache.create
driver.cache.retrieve
driver.cache.init
