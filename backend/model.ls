require! './main': {backend, aux}
require! './model-base': model
require! './DAL': DAL

# usaage:
# require! <[./backend/model]>
# model.driver.use "your desire driver"
# yourModel = new model { ... } 

store = null
model.driver = do
  instance: null
  drivers: {}
  init: (name, config={}) -> if !@drivers[name]? => @drivers[name] = new DAL name, config
  _config: {}
  config: (config) -> @_config = config
  use: (name) ->
    @init name, @_config
    @instance = store := @drivers[name]

model.prototype.interface = do
  save: -> store.write @get-type!name, @key, @
  delete: -> store.delete @get-type!name, @key

model.prototype <<< do
  read: (key) -> store.read @name, key
  write: (key, data) -> store.write @name, key, data
  list: (key, values) -> store.list @name, key, values
  delete: (key) -> store.delete @name, key

model.prototype.rest = (api, config) ->
  api.post "/#{@name}/", (req, res) ~>
    data = req.body
    if @lint(req.body).0 => return aux.r400 res
    data = @clean data
    data.save!then (ret) -> res.send ret
  api.get "/#{@name}/:id", (req, res) ~>
    @read req.params.id
      ..then (ret) ->
        if !ret => return aux.r404 res
        return res.json ret
      ..catch -> return aux.r403 res
  api.put "/#{@name}/:id", (req, res) ~>
    data = req.body
    if @lint(req.body).0 => return aux.r400 res
    data = @clean data
    data.save!then (ret) -> res.send ret
  api.delete "/#{@name}/:id", (req, res) ~>
    @read req.params.id
      ..then (ret) -> 
        if !ret => return aux.r404 res
      ..catch -> return aux.r403 res

module.exports = model
