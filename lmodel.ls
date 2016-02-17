require! <[bluebird ./backend/model]>

store = null
base = {}

base.dataset = new model do
  name: \dataset
  types: <[csv]>
  default-fields: true
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
  default-fields: true
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}

chart-config = do
  name: \chart
  default-fields: true
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    desc: {max: 200, min: 1, required: false, type: model.type.string}
    tags: {max: 200, min: 1, required: false, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}
    theme: {required: false, type: model.type.key({type:base.theme})}
    assets: {required: false, type: model.type.array({type: base.file})}
    config: {require: false}
    dimension: {require: false}
    data: {required: false}
    permission: {required: false, type: model.type.permission}
    thumbnail: {required: false, type: model.type.string}
    is-type: {required: false, type: model.type.boolean}

base.chart = new model chart-config

module.exports = (storeOuter) ->
  store := storeOuter
  base
