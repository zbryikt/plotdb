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

base.data = new model do
  name: \data
  base: do
    name: {max: 100, min: 1required: true, type: model.type.string}

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

base.charttype = new model do
  name: \charttype
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}
    theme: {required: false, type: model.type.key({type:base.theme})}
    owner: {required: true, type: model.type.key({type:base.user})}

base.chartobj = new model do
  name: \chartobj
  base: do
    name: {max: 100, min: 1, required: true, type: model.type.string}
    doc: {type: base.file}
    style: {type: base.file}
    code: {type: base.file}
    theme: {type: base.theme}
    type: {type: base.charttype}

module.exports = (storeOuter) ->
  store := storeOuter
  base
