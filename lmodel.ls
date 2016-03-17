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
    for key in <[createdTime modifiedTime]> =>
      if !it[key] => continue
      ret = model.type.date.lint(it[key])
      if ret.0 => return ret
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
    createdTime: {required: false, type: model.type.date}
    modifiedTime: {required: false, type: model.type.date}

chart-config = do
  name: \chart
  default-fields: true
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    desc: {max: 200, min: 1, required: false, type: model.type.string}
    basetype: {max: 20, min: 1, required: false, type: model.type.string}
    visualencoding: { max: 10, required: false, type: model.type.array({max: 20, min: 1, type: model.type.string})}
    category: { max: 10, required: false, type: model.type.array({max: 20, min: 1, type: model.type.string})}
    tags: { required: false, type: model.type.array({max: 50, min: 1, type: model.type.string})}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}
    theme: {required: false, type: model.type.key({type:base.theme})}
    assets: {required: false, type: model.type.array({type: base.file})}
    config: {require: false}
    dimension: {require: false}
    data: {required: false}
    likes: {required: false, type: model.type.number}
    parent: { required: false, type: model.type.key({type: base.chart})}
    permission: {required: false, type: model.type.permission}
    thumbnail: {required: false, type: model.type.string}
    is-type: {required: false, type: model.type.boolean}
    createdTime: {required: false, type: model.type.date}
    modifiedTime: {required: false, type: model.type.date}

base.chart = new model chart-config

module.exports = (storeOuter) ->
  store := storeOuter
  base
