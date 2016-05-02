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
    gray: \#cccccc
    subtype: do
      negative: "negative"
      positive: "positive"
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
    qualitative: {colors: <[#c05ae0 #cf2d0c #e9ab1e #86ffb5 #64dfff #003f7d]>.map(->{hex:it})}
    binary: {colors: <[#ff8356 #0076a1]>.map(->{hex:it})}
    sequential: {colors: <[#950431 #be043e #ec326d #fc82a9 #febed2 #fee6ee]>.map(->{hex:it})}
    diverging: {colors: <[#74001a #cd2149 #f23971 #ff84ab #ffc3d7 #f2f2dd #b8d9ed #81b1d0 #3d8bb7 #0071a8 #003558]>.map(->{hex:it})}
    subtype: do
      qualitative: "qualitative"
      binary: "binary"
      sequential: "sequential"
      diverging: "diverging"
    scale: do
      ordinal: (pal) ->
        c = pal.colors
        range = (c.filter(->it.keyword).map(->it.hex) ++ c.filter(->!it.keyword).map(->it.hex))
        domain = c.map(-> it.keyword).filter(-> it)
        d3.scale.ordinal!domain domain .range range

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

plotdb.data = do
  sample: do
    category: <[IT RD GM FIN LEGAL HR SALES]>
    name: <[James Joe Amelie Doraemon Cindy David Frank Kim Ken Leland Mike Nick Oliver Randy]>
    generate: (dimension) ->
      ret = for i from 0 til parseInt(Math.random! * 10 + 10) =>
        node = {}
        for k,v of dimension =>
          if !v.type or !v.type.length => node[k] = @name[parseInt(Math.random! * @name.length)]
          else node[k] = parseInt(Math.random! * 8) + 2
        node
      return ret
    crimean-war: {"month":{"name":"month","data":["01/04/1854","01/05/1854","01/06/1854","01/07/1854","01/08/1854","01/09/1854","01/10/1854","01/11/1854","01/12/1854","01/01/1855","01/02/1855","01/03/1855","01/04/1855","01/05/1855","01/06/1855","01/07/1855","01/08/1855","01/09/1855","01/10/1855","01/11/1855","01/12/1855","01/01/1856","01/02/1856","01/03/1856"]},"army size":{"name":"army size","data":[8571,23333,28333,28722,30246,30290,30643,29736,32779,32393,30919,30107,32252,35473,38863,42647,44614,47751,46852,37853,43217,44212,43485,46140]},"death number by zymotic":{"name":"death number by zymotic","data":[1,12,11,359,828,788,503,844,1725,2761,2120,1205,477,508,802,382,483,189,128,178,91,42,24,15]},"death number by wound":{"name":"death number by wound","data":[0,0,0,0,1,81,132,287,114,83,42,32,48,49,209,134,164,276,53,33,18,2,0,0]},"death number by other":{"name":"death number by other","data":[5,9,6,23,30,70,128,106,131,324,361,172,57,37,31,33,25,20,18,32,28,48,19,35]},"zymotic rate(‰)":{"name":"zymotic rate(‰)","data":[1.4,6.2,4.7,150,328.5,312.2,197,340.6,631.5,1022.8,822.8,480.3,177.5,171.8,247.6,107.5,129.9,47.5,32.8,56.4,25.3,11.4,6.6,3.9]},"wound rate(‰)":{"name":"wound rate(‰)","data":[0,0,0,0,0.4,32.1,51.7,115.8,41.7,30.7,16.3,12.8,17.9,16.6,64.5,37.7,44.1,69.4,13.6,10.5,5,0.5,0,0]},"other rate(‰)":{"name":"other rate(‰)","data":[7,4.6,2.5,9.6,11.9,27.7,50.1,42.8,48,120,140.1,68.6,21.2,12.5,9.6,9.3,6.7,5,4.6,10.1,7.8,13,5.2,9.1]}}
