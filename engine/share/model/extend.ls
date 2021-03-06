base = (model) ->

  #TODO: add transformer
  base.dataset = new model do
    name: \dataset
    types: <[csv json]>
    #default-fields: true
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
      config: {required: false, max: 1024, type: model.type.json} # for dynamic / realtime configuration

  base.datafield = new model do
    name: \datafield
    base:
      dataset: {required: true, type: model.type.key({type:base.dataset})}
      datasetname: { required: true, type: model.type.string }
      name: { required: true, type: model.type.string }
      location: { required: true, type: model.type.string }
      datatype: { type: model.type.string }
      hash: { type: model.type.string} # check if data changed
      data: { type: model.type.json}

  base.dataset.config.base.fields = { require: true, type: model.type.array({type: base.datafield}) }

  base.file = new model do
    name: \file
    base: do
      name: {max: 100, min: 1, required: false, type: model.type.string}
      type: {max: 20, min: 0, required: false, type: model.type.string}
      content: {required: false, type: model.type.string}

  base.theme = new model do
    name: \theme
    default-fields: true
    base: do
      name: {max: 100, min: 1, required: true, type: model.type.string}
      owner: {required: true, type: model.type.key({type:model.type.user})}
      chart: {require: false, type: model.type.number} # for cross reference issue
      parent: { required: false, type: model.type.key({type: base.theme})}
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

  base.chart = new model do
    name: \chart
    default-fields: true
    base: do
      name: {max: 100, min: 1, required: true, type: model.type.string}
      owner: {required: true, type: model.type.key({type:model.type.user})}
      theme: {required: false, type: model.type.key({type:base.theme})}
      parent: { required: false, type: model.type.key({type: base.chart})}
      description: {max: 500, required: false, type: model.type.string}
      footer: {max: 500, required: false, type: model.type.string}
      metashow: { required: false, type: model.type.boolean }
      basetype: {max: 20, required: false, type: model.type.array({max: 20, type: model.type.string})}
      visualencoding: { max: 10, required: false, type: model.type.array({max: 20, type: model.type.string})}
      category: { max: 10, required: false, type: model.type.array({max: 20, type: model.type.string})}
      tags: { required: false, type: model.type.array({max: 50, type: model.type.string})}
      likes: {required: false, type: model.type.number}
      searchable: { required: false, type: model.type.boolean }
      dimlen: { required: true, type: model.type.number }
      dimension: { required: false, type: model.type.json }
      config: { required: false, type: model.type.json }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      doc: {type: base.file}
      style: {type: base.file}
      code: {type: base.file}
      inherit: {max: 10, required: false, type: model.type.array({max: 20, type: model.type.string})}
      assets: {required: false, type: model.type.array({type: base.file})}
      permission: {required: false, type: model.type.permission}
      library: { required: false, type: model.type.array({type: model.type.string})}
      local: { required: false, type: model.type.json }
      #TODO: add mapping or binding for dataset fields in chart

  base.palette = new model do
    name: \palette
    default-fields: true
    base: do
      name: {max: 100, min: 1, required: true, type: model.type.string}
      owner: {required: true, type: model.type.key({type:model.type.user})}
      description: {max: 200, required: false, type: model.type.string}
      colors: { required: false, type: model.type.json }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      permission: {required: false, type: model.type.permission}

  base.request = new model do
    name: \request
    default-fields: true
    base: do
      owner: {required: true, type: model.type.key({type:model.type.user})}
      name: {max: 100, min: 1, required: true, type: model.type.string}
      config: {required: false, type: model.type.json}

  base.comment = new model do
    name: \discussion
    default-fields: true
    base: do
      owner: {required: true, type: model.type.key({type:model.type.user})}
      content: {required: true, type: model.type.stirng}
      request: {required: false, type: model.type.key({type:model.type.request})}
      main: {required: false, type: model.type.boolean }

  base.team = new model do
    name: \team
    default-fields: true
    base: do
      owner: {required: true, type: model.type.key({type: model.type.user})}
      name: {max: 100, min: 1, required: true, type: model.type.string}
      description: {max: 512, required: false, type: model.type.string}
      createdtime: {type: model.type.date}
      modifiedtime: {type: model.type.date}
      avatar: {max: 100, type: model.type.string}
      permission: {type: model.type.permission}
  base.team-member = new model do
    name: \team-member
    base: do
      member: {required: true, type: model.type.key({type: model.type.user})}
      team: {required: true, type: model.type.key({type: base.team})}
  base.team-chart = new model do
    name: \team-chart
    base: do
      chart: {required: true, type: model.type.key({type: base.chart})}
      team: {required: true, type: model.type.key({type: base.team})}
  base.team-dataset = new model do
    name: \team-dataset
    base: do
      dataset: {required: true, type: model.type.key({type: base.dataset})}
      team: {required: true, type: model.type.key({type: base.team})}
  base.team-theme = new model do
    name: \team-theme
    base: do
      theme: {required: true, type: model.type.key({type: base.theme})}
      team: {required: true, type: model.type.key({type: base.team})}
  base.payment-history = new model do
    name: \payment-history
    base: do
      owner: {required: true, type: model.type.key({type:model.type.user})}
      status: {required: true, type: model.type.number}
      id: {required: true, type: model.type.string}
      date: {required: true, type: model.type.date}
      amount: {required: true, type: model.type.number}
      plan: {require: true, type: model.type.string}
      method: {require: true, type: model.type.string}

  base.folder = new model do
    name: \folder
    base: do
      owner: {required: true, type: model.type.key({type:model.type.user})}
      name: {max: 100, min: 1, required: true, type: model.type.string}
      description: {max: 512, required: false, type: model.type.string}
      likes: {required: false, type: model.type.number}
      searchable: { required: false, type: model.type.boolean }
      createdtime: {required: false, type: model.type.date}
      modifiedtime: {required: false, type: model.type.date}
      permission: {type: model.type.permission}
      thumbnail: { type: model.type.number }
  base.folder-content = new model do
    name: \folder-content
    base: do
      folder: {required: true, type: model.type.key({type: base.folder})}
      name: {required: true, type: model.type.stirng}
      item: {required: true, type: model.type.number}
      type: {required: true, type: model.type.string}

  base

module.exports = base
