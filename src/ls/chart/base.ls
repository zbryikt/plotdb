plotdb = {}
plotdb <<< do
  Number: name: \Number, test: (-> !isNaN(+it)), level: 3, parse: -> parseFloat(it)
  String: name: \String, test: (-> true), level: 1, parse: -> it
  Date: 
    name: \Date, level: 2
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
  Color: do
    name: \Color
    level: 4
    test: -> !!!/(rgba?|hsla?)\([0-9.,]+\)|#[0-9a-f]{3,6}|[a-z0-9]+/.exec(it.trim!)
    default: \#dc4521
  Palette: do
    name: \Palette
    level: 5
    re: /^((rgb|hsl)\((\s*[0-9.]+\s*,){2}\s*[0-9.]+\s*\)|(rgb|hsl)a\((\s*[0-9.]+\s*,){3}\s*[0-9.]+\s*\)|\#[0-9a-f]{3}|\#[0-9a-f]{6}|[a-zA-Z][a-zA-Z0-9]*)$/
    test: -> 
      if !it => return true
      if typeof(it) == typeof("") =>
        if it.charAt(0) != '[' => it = it.split(\,)
        else 
          try
            it = JSON.parse(it)
          catch
            return false
      else if Array.isArray(it) =>
        return if !it.filter(~>!!!@re.exec(it.trim!)).length => true else false
      else if typeof(it) == \object =>
        if !(it.colors?) => return true
        if it.colors.filter(->!it.hex).length => return true
      return false
    parse: -> 
      if !it => return it
      if Array.isArray(it) => return it
      if typeof(it) == typeof("") =>
        try
          return JSON.parse(it)
        catch
          return it.split(\,).map(->{hex: it.trim!})
      return it 
    default: {colors: <[#1d3263 #226c87 #f8d672 #e48e11 #e03215 #ab2321]>.map(->{hex:it})}
    plotdb:  {colors: <[#ed1d78 #c59b6d #8cc63f #28aae2]>.map(->{hex:it})}
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
    dimension: do
      value: {type: [], require: false}
    config: do
      padding: {type: [plotdb.Number], default: 10}
    init: (root, data, config) ->
    bind: (root, data, config) ->
    resize: (root, data, config) ->
    render: (root, data, config) ->

plotdb.theme = do
  create: (config) ->
    {} <<< @base <<< config
  base: do
    palette: do
      default: []
      diverging: []
      sequential: []
      binary: []
      qualitative: []
      # 2 dimensional
      binary-diverge: []
      sequential-qualitative: []
      sequential-sequential: []
      diverging-diverging: []
    config: do
      padding: {type: [plotdb.Number], default: 10}
