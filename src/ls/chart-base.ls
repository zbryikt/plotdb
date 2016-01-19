plotdb = {}
plotdb <<< do
  Number: name: \Number, test: (-> !isNaN(+it)), level: 2, parse: -> parseFloat(it)
  String: name: \String, test: (-> true), level: 1, parse: -> it
  Date: 
    name: \Date, level: 3
    test: -> 
      d = new Date(it)
      return if !(d instanceof Date) or isNaN(d.getTime!) => false else true
    parse: -> new Date(it)
  Choice: (v) -> 
    return do
      name: \Choice
      level: 4
      test: -> v and v.length and (it in v)
      values: v
  Percent: name: \Percent, level: 3, test: -> !!/[0-9.]+%/.exec(it)
  Color: name: \Color, level: 4, test: -> !!!/(rgba?|hsla?)\([0-9.,]+\)|#[0-9a-f]{3,6}|[a-z0-9]+/.exec(it.trim!)
  Palette: do
    name: \Palette
    level: 5
    test: -> 
      re = /^((rgb|hsl)\((\s*[0-9.]+\s*,){2}\s*[0-9.]+\s*\)|(rgb|hsl)a\((\s*[0-9.]+\s*,){3}\s*[0-9.]+\s*\)|\#[0-9a-f]{3}|\#[0-9a-f]{6}|[a-zA-Z][a-zA-Z0-9]*)$/
      if typeof(it) == typeof("") =>
        if it.charAt(0) != '[' => it = it.split(\,)
        else 
          try
            it = JSON.parse(it)
          catch
            return false
      if it and typeof(it) == typeof([]) and it.length =>
        return if !it.filter(->!!!re.exec(it.trim!)).length => true else false
      return false
    parse: -> 
      if !it => return it
      if typeof(it) == typeof({}) and it.length => return it
      if typeof(it) == typeof("") =>
        try
          return JSON.parse(it)
        catch
          return it.split(\,).map(->it.trim!)
      return it 
    default: <[#1d3263 #226c87 #f8d672 #e48e11 #e03215 #ab2321]>
  Boolean:
    name: \Boolean, level: 2,
    test: -> !!/^(true|false|1|0|yes|no)$/.exec(it)
    parse: -> 
      if it and typeof(it) == typeof("") =>
        if /^(yes|true)$/.exec(it.trim!) => return true
        if /\d+/.exec(it.trim!) and it.trim! != "0" => return true
        return false
      if it => return true
      return false


plotdb.chart = do
  corelib: {}
  create: (config) ->
    {} <<< @base <<< config
  base: do
    name: \base
    title: 'chart template'
    desc: null
    mapping: do
      value: {type: [], require: false}
    config: do
      padding: {type: [plotdb.Number], default: 10}
    init: (root, data, config) ->
    bind: (root, data, config) ->
    resize: (root, data, config) ->
    render: (root, data, config) ->
