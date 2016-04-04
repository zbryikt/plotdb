base = (model) ->

  base.json = new model do
    name: \json

  #TODO: add transformer
  base.dataset = new model do
    name: \dataset
    types: <[csv json]>
    default-fields: true
    base: do
      owner: {required: true, type: model.type.key({type:model.type.user})}
      parent: { required: false, type: model.type.key({type: base.theme})}
      name: {max: 100, min: 1, required: true, type: model.type.string}
      description: {max: 512, required: false, type: model.type.string}
      # set after datafield is created
      #fields: { require: true, type: model.type.array({type: base.datafield}) }
      rows: { require: true, type: model.type.number }
      size: { require: true, type: model.type.number }
      tags: { required: false, type: model.type.array({max: 50, min: 1, type: model.type.string})}
      likes: {required: false, type: model.type.number}
      searchable: { required: false, type: model.type.boolean }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      permission: {type: model.type.permission}
      type: {required: true, type: model.type.string} # static / dynamic / realtime
      format: {required: true, type: model.type.string} # csv / json
      config: {required: false, max: 1024, type: base.json} # for dynamic / realtime configuration

  base.datafield = new model do
    name: \datafield
    base:
      dataset: {required: true, type: model.type.key({type:base.dataset})}
      datasetname: { required: true, type: model.type.string }
      name: { required: true, type: model.type.string }
      location: { required: true, type: model.type.string }
      datatype: { type: model.type.string }
      hash: { type: model.type.string} # check if data changed
      data: { type: base.json} 
  
  base.dataset.config.base.fields = { require: true, type: model.type.array({type: base.datafield}) }

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
      owner: {required: true, type: model.type.key({type:model.type.user})}
      parent: { required: false, type: model.type.key({type: base.theme})}
      name: {max: 100, min: 1, required: true, type: model.type.string}
      description: {max: 512, required: false, type: model.type.string}
      tags: { required: false, type: model.type.array({max: 50, min: 1, type: model.type.string})}
      likes: {required: false, type: model.type.number}
      searchable: { required: false, type: model.type.boolean }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      doc: {type: base.file}
      style: {type: base.file}
      code: {type: base.file}
      assets: {required: false, type: model.type.array({ type: base.file })}
      permission: {type: model.type.permission}

  chart-config = do
    name: \chart
    default-fields: true
    base: do
      name: {max: 100, min: 1, required: true, type: model.type.string}
      owner: {required: true, type: model.type.key({type:model.type.user})}
      theme: {required: false, type: model.type.key({type:base.theme})}
      parent: { required: false, type: model.type.key({type: base.chart})}
      description: {max: 200, required: false, type: model.type.string}
      basetype: {max: 20, required: false, type: model.type.array({max: 20, type: model.type.string})}
      visualencoding: { max: 10, required: false, type: model.type.array({max: 20, type: model.type.string})}
      category: { max: 10, required: false, type: model.type.array({max: 20, type: model.type.string})}
      tags: { required: false, type: model.type.array({max: 50, type: model.type.string})}
      likes: {required: false, type: model.type.number}
      searchable: { required: false, type: model.type.boolean }
      dimlen: { required: true, type: model.type.number }
      dimension: { required: false, type: base.json }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      doc: {type: base.file}
      style: {type: base.file}
      code: {type: base.file}
      assets: {required: false, type: model.type.array({type: base.file})}
      permission: {required: false, type: model.type.permission}
      #config: {require: false}
      #dimension: {require: false}
      #data: {required: false}
      #TODO: add mapping or binding for dataset fields in chart

  base.chart = new model chart-config
  base

module.exports = base
