require! './main': {backend, aux}
require! './model-base': model
require! './DAL': DAL

# usaage:
# require! <[./backend/model]>
# model.driver.use "your desire driver"
# yourModel = new model { ... } 

# to use rest api model must have:
#  - key / owner / permission ( check model.ls comments )

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

#TODO permissions check
model.prototype.rest = (api, config) ->
  if !@config.base.owner or !@config.base.key =>
    console.log "[WARNING] init RestAPI: #{@name} model doesn't have owner and key fields."
    console.log "[WARNING] use 'default-fields' to enable owner/key fields for RestAPI"
    return
  api.post "/#{@name}/", (req, res) ~>
    data = req.body
    data <<< {owner: req.user.key, key: null}
    ret = @lint(data)
    if ret.0 => return aux.r400 res, ret
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
    if !data.key == req.params.id => return aux.r400 res, [true, data.key, \key-mismatch]
    @read req.params.id
      ..then (ret) ~>
        if !ret => return aux.r404 res
        data = req.body
        if ret.owner != req.user.key => return aux.r403 res
        data <<< owner: req.user.key, key: req.params.id
        ret = @lint(data)
        if ret.0 => return aux.r400 res, ret
        data = @clean data
        data.save!then (ret) -> res.send ret
      ..catch -> return aux.r403 res

  api.delete "/#{@name}/:id", (req, res) ~>
    @read req.params.id
      ..then (ret) ~> 
        if !ret => return aux.r404 res
        if ret.owner != req.user.key => return aux.r403 res
        @delete req.params.id
      ..catch -> return aux.r403 res
    #TODO complete this

module.exports = model
