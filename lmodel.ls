require! <[bluebird ./backend/model]>

store = null
base = {}

base.user = new model do
  name: \user
  base: do
    username: {required: true, type: model.type.email}
    password: {type: model.type.string}
    usepasswd: {type: model.type.boolean}
    displayname: {max: 30, min: 3, required: true, type: model.type.string}
    desc: {max: 1000, type: model.type.string}
    create_date: {type: model.type.date}
    public_email: {type: model.type.boolean}
    avatar: {max: 300, type: model.type.string}
  expand: (data) ->
    if typeof(data) == typeof({}) => return new bluebird (res, rej) -> res data
    new bluebird (res, rej) -> store.read \user, data .then (obj) ->
      <[password usepasswd username _id]>.map -> delete obj[it]
      res obj

base.dataset = new model do
  name: \dataset
  types: <[csv]>
  lint: ->
    if !it => return [true]
    if typeof(it) != 'object' => return [true]
    if !it.name or typeof(it.name) != 'string' => return [true, null, \name]
    if !(it.datatype in base.dataset.config.types) => return [true, null, \type]
    #TODO lint data by type
    #TODO lint permission
    return [false]

base.file = new model do
  name: \file
  base: do
    name: {max: 100, min: 1, required: false, type: model.type.string}
    type: {max: 20, min: 1, required: false, type: model.type.string}
    content: {required: false, type: model.type.string}

base.theme = new model do
  name: \theme
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}

base.permission = new model do
  name: \permission
  switches: <[private public list token]>
  lint: -> 
    if typeof(it) != 'object'  => return [true]
    if (it.switch?) and !Array.isArray(it.switch) => return [true]
    if (it.value?) and !Array.isArray(it.value) => return [true]
    for item in it.switch => if !(item in base.permission.config.switches) => return [true]
    for item in it.value =>
      if !Array.isArray(item) or item.length< 2 => return [true]
      if !(item.1 in base.permission.switches) => return [true]
      #TODO check item.0 ?
    return [false]
    
chart-config = do
  name: \charttype
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    desc: {max: 200, min: 1, required: false, type: model.type.string}
    tags: {max: 200, min: 1, required: false, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}
    theme: {required: false, type: model.type.key({type:base.theme})}
    #owner: {required: true, type: model.type.key({type:base.user})}
    assets: {required: false, type: model.type.array({type: base.file})}
    config: {require: false}
    dimension: {require: false}
    permission: {required: false, type: base.permission}
    thumbnail: {required: false, type: model.type.string}
    is-type: {required: false, type: model.type.boolean}

base.charttype = new model chart-config
base.chart = new model do
  name: \chart
  base: chart-config.base

module.exports = (storeOuter) ->
  store := storeOuter
  base
