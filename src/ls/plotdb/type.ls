if !(plotdb?) => plotdb = {}

# Type Hierarchy and Matching Order ( * for primitive type )
# *  2 String
# *  4   Order         -> String
# *  6     Numstring   -> Order
# *  8       Date      -> Numstring
#    8       HSLA      -> Numstring, Color  # not implemented
#    8       RGBA      -> Numstring, Color  # not implemented
# *  8       Number    -> Numstring, JSON
# *  8     Month       -> Order
# *  8     Weekday     -> Order
# *  8     Boolean     -> Order
# * 10       Bit       -> Boolean, Number
#    4   Color         -> String
#    4   JSON          -> String            # not implemented
#    6     Array       -> JSON              # not implemented
#    8       Range     -> Array             # not implemented
#    6     Object      -> JSON              # not implemented
#    8       Palette   -> Object
#    8       Choice    -> Object


plotdb.String = do
  name: \String, default: "", level: 2
  basetype: []
  test: (-> true)
  parse: -> it or ""

# plotdb.Order uses plotdb.OrderTypes, which is defined below
plotdb.Order = do
  name: \Order, default: (k,v,i) -> i, level: 4
  basetype: [plotdb.String]
  test: (v) -> !!(plotdb.OrderTypes.map((type)->type.test v).filter(->it).0)
  parse: -> it
  order: do
    Ascending: (a,b) -> if b > a => -1 else if b < a => 1 else 0
    Descending: (a,b) -> if b > a => 1 else if b < a => -1 else 0
  # if we dont proide fieldname, then data will be sorted directly.
  sort: (data, fieldname, is-ascending = true) ->
    field = if fieldname => data.map(->it[fieldname]) else data
    types = plotdb.OrderTypes.map(->it)
    for i from 0 til field.length
      for j from 0 til types.length
        if !types[j].test(field[i]) => types[j] = null
      types = types.filter(->it)
    type = types[0]
    sorter = ((type or {}).order or @order)[if is-ascending => \Ascending else \Descending]
    if fieldname =>
      if type => for i from 0 til data.length => data[i][fieldname] = type.parse data[i][fieldname]
      data.sort((a,b)-> sorter(a[fieldname], b[fieldname]))
    else
      if type => for i from 0 til data.length => data[i] = type.parse data[i]
      data.sort sorter
    #TODO if we can speed up further?

plotdb.Boolean = do
  name: \Boolean, default: true, level: 8
  basetype: [plotdb.Order]
  test: -> !!/^(true|false|yes|no|[yntf01])$/.exec(it)
  parse: ->
    if it and typeof(it) == \string =>
      if /^(yes|true|[yt])$/.exec(it.trim!) => return true
      if /\d+/.exec(it.trim!) and it.trim! != "0" => return true
      return false
    return !!it
  order: do
    Descending: (a,b) -> b - a
    Ascending: (a,b) -> a - b
    index: -> if it => 1 else 0


plotdb.Bit = do
  name: \Bit, default: 0, level: 10
  basetype: [plotdb.Boolean]
  test: -> !!/^[01]$/.exec(it)
  parse: -> return if !it or it == "0" => 0 else 1
  order: do
    Descending: (a,b) -> b - a
    Ascending: (a,b) -> a - b
    index: -> it

plotdb.Numstring = do
  name: \Numstring, default: "", level: 6
  basetype: [plotdb.Order]
  test: ->
    if typeof(it) == \object and it.type == \Numstring => return true
    /\d+/.exec("#it")
  parse: ->
    if typeof(it) == \object and it.type == \Numstring => return it
    numbers = []
    num = if it.split => it.split(/\.?[^0-9.]+/g) else [it]
    for j from 0 til num.length => if num[j] => numbers.push parseFloat(num[j])
    return new plotdb.Numstring.object({raw: it, numbers, len: numbers.length})
  order: do
    Ascending: (a,b) ->
      if !a => return if !b => 0 else -1
      na = a.numbers
      nb = b.numbers
      for i from 0 til a.len
        v = na[i] - nb[i]
        if v => return v
      return a.len - b.len
    Descending: (a,b) -> plotdb.Numstring.order.Ascending b,a
    index: -> it.numbers.0
  object: ({raw, numbers, len}) -> @ <<< {raw: "#raw", numbers, len, type: "Numstring"}
plotdb.Numstring.object.prototype.toString = -> @raw

plotdb.Number = do
  name: \Number, default: 0, level: 8
  basetype: [plotdb.Numstring]
  test: -> !isNaN(+("#{it or ''}".replace(/,/g,'').replace(/%$/,'')))
  parse: ->
    if typeof(it) == \string =>
      it = parseFloat(it.replace(/,/g,''))
      if /%$/.exec(it) => it = (+it.replace(/%$/,''))/100
    +it
  order: do
    Ascending: ((a,b) -> a - b)
    Descending: ((a,b) -> b - a)
    index: -> it

plotdb.Date = do
  name: \Date, default: \1970/1/1 ,level: 8
  basetype: [plotdb.Numstring]
  test: ->
    if !it => return false
    if typeof(it) == \object and it.type == \Date => return true
    return if !/^\d*$/.exec(it) and @parse(it) => true else false
  parse: ->
    if typeof(it) == \object and it.type == \Date => return it
    twdate = /^(\d{2,3})\/([01]?\d)(?:\/([0123]?\d))?$/.exec(it)
    if twdate => d = new Date(twdate.1, twdate.2, twdate.3)
    else d = new Date(it)
    if !(d instanceof Date) or isNaN(d.getTime!) =>
      ret = /^(\d{1,2})[/-](\d{4})$/.exec it
      if !ret => return null
      d = new Date(ret.2, parseInt(ret.1) - 1)
    return new plotdb.Date.object({raw: it, parsed: d})
  order: do
    Ascending: (a,b) ->  return a.parsed.getTime! - b.parsed.getTime!
    Descending: (a,b) -> return b.parsed.getTime! - a.parsed.getTime!
    index: -> it.parsed.getTime!
  object: ({raw, parsed}) -> @ <<< {raw: "#raw", parsed, type: "Date"}
plotdb.Date.object.prototype.toString = -> @raw

plotdb.Weekday = do
  name: \Weekday, default: \Mon, level: 8
  basetype: [plotdb.Order]
  values: do
    abbr: <[mon tue wed thu fri sat sun]>
    en: <[monday tuesday wednesday thursday friday saturday sunday]>
    zh: <[週一 週二 週三 週四 週五 週六 週日]>
  test: ->
    value = if typeof(it)==\string => it.toLowerCase! else it
    for k,v of @values =>
      idx = v.indexOf(value)
      if idx >=0 => return true
    return false
  parse: -> it
  order: do
    index: ->
      value = it.toLowerCase!
      for k,v of plotdb.Weekday.values =>
        idx = v.indexOf(value)
        if idx>=0 => return idx
      return -1
    Ascending: (a,b) ->
      a = plotdb.Weekday.order.index a
      b = plotdb.Weekday.order.index b
      return a - b
    Descending: (a,b) ->
      a = plotdb.Weekday.order.index a
      b = plotdb.Weekday.order.index b
      return b - a

plotdb.Month = do
  name: \Month, default: \Jan, level: 8
  basetype: [plotdb.Order]
  values: do
    abbr: <[jan feb mar apr may jun jul aug sep oct nov dec]>
    en: <[january feburary march april may june july august september october november december]>
    zh: <[一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月]>
  test: ->
    value = if typeof(it)==\string => it.toLowerCase! else it
    for k,v of @values =>
      idx = v.indexOf(value)
      if idx >=0 => return true
    return false
  parse: -> it
  order: do
    index: ->
      value = it.toLowerCase!
      for k,v of plotdb.Month.values =>
        idx = v.indexOf(value)
        if idx>=0 => return idx
      return -1
    Ascending: (a,b) ->
      a = plotdb.Month.order.index a
      b = plotdb.Month.order.index b
      return a - b
    Descending: (a,b) ->
      a = plotdb.Month.order.index a
      b = plotdb.Month.order.index b
      return b - a

plotdb.Range = do
  name: \Range, default: [0,1]
  test: -> !!plotdb.Range.parse(it)
  parse: ->
    if typeof(it) == \string =>
      try
        it = JSON.parse(it)
      catch
        return false
    if Array.isArray(it) and it.length == 2 =>
      it.0 = parseFloat(it.0)
      it.1 = parseFloat(it.1)
      if isNaN(it.0) or isNaN(it.1) => return null
      return it
    return null

plotdb.Choice = (v) ->
  return do
    default: ""
    name: \Choice
    level: 20
    test: -> v and v.length and (it in v)
    values: v

plotdb.EditableChoice = (v) ->
  return do
    default: ""
    name: \EditableChoice
    level: 20
    test: -> v and v.length and (it in v)
    values: v

plotdb.Color = do
  name: \Color
  level: 10
  test: -> !!!/(rgba?|hsla?)\([0-9.,]+\)|#[0-9a-f]{3,6}|[a-z0-9]+/.exec(it.trim!)
  default: \#dc4521
  Gray: \#cccccc
  Positive: \#3f7ab5
  Negative: \#d93510
  Neutral: \#cccccc
  Empty: \#ffffff
  subtype: do
    negative: "negative"
    positive: "positive"
    neutral: "neutral"

plotdb.Palette = do
  name: \Palette
  level: 30
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
    # example: [{data: [...], datatype: "SomeTypeName"}]
    auto: (pal, fields = [], scale) ->
      if !Array.isArray(fields) => fields = [fields]
      type = plotdb.Types.taxonomy((fields[0] or {}).datatype)
      c = pal.colors
      if type == \quantative =>
        domain = c.map(-> if !(it.keyword?) or it.keyword=="" => "" else +it.keyword)
        range = c.map(->it.hex)
        start = 0
        extent = [
          Math.min.apply(null, fields.map(-> Math.min.apply(null, it.data or []))),
          Math.max.apply(null, fields.map(-> Math.max.apply(null, it.data or [])))
        ]
        if !domain.0? => domain.0 = extent.0
        if !domain[* - 1] => domain[* - 1] = extent.1
        for end from 0 til domain.length
          if domain[end] and end > start + 1 =>
            for idx from 1 til (end - start)
              domain[idx + start] = domain[start] + idx * ((domain[end] - domain[start]) / (end - start))
          if domain[end] => start = end
      else =>
        hash = {}
        domain = c.map(->it.keyword).filter(->it)
        fields.map (d)-> (d.data or []).map -> if !(it in domain) => hash[it] = 1
        domain ++= [k for k of hash]
        range = (c.filter(->it.keyword).map(->it.hex) ++ c.filter(->!it.keyword).map(->it.hex))
      if !scale =>
        if type == \quantative => scale = d3.scale.linear!
        else => scale = d3.scale.ordinal!
      scale.domain(domain).range(range)

    ordinal: (pal, domain, scale) ->
      c = pal.colors
      range = (c.filter(->it.keyword).map(->it.hex) ++ c.filter(->!it.keyword).map(->it.hex))
      if !domain =>
        if scale => domain = scale.domain!
        else domain = c.map(-> it.keyword).filter(-> it)
      if !scale => scale = d3.scale.ordinal!
      scale.domain domain .range range
    linear: (pal, domain, scale) ->
      c = pal.colors
      range = (c.filter(->it.keyword).map(->it.hex) ++ c.filter(->!it.keyword).map(->it.hex))
      if !domain =>
        if scale => domain = scale.domain!
        else domain = c.map(->it.keyword).filter(->it?)
      if !scale => scale = d3.scale.linear!
      if range.length == 1 => range.push range.0
      if domain.length == 2 and range.length > 2 =>
        domain = d3.range(range.length).map(->(domain.1 - domain.0 ) * it/((range.length - 1) or 1) + domain.0)
      scale.domain domain .range range

plotdb.OrderTypes = [
  plotdb.Number, plotdb.Date, plotdb.Numstring, plotdb.Month, plotdb.Weekday, plotdb.Boolean, plotdb.Bit
]
plotdb.QuantativeTypes = [
  plotdb.Number, plotdb.Date, plotdb.Numstring
]

plotdb.Types = do
  # String will be used automatically if there is no matched type
  list: <[Number Numstring Weekday Month Date Boolean Bit Order]>
  taxonomy: (type) ->
    if typeof(type) == \string => type = plotdb[type]
    if type in plotdb.QuantativeTypes => return "quantative"
    if type in plotdb.OrderTypes => return "ordinal"
    return "nominal"
  resolve-array: (vals) ->
    matched-types = [[0,\String]]
    for j from 0 til @list.length =>
      type = plotdb[@list[j]]
      matched = true
      for k from 0 til vals.length =>
        if !type.test(vals[k]) =>
          matched = false
          break
      if matched => matched-types.push [plotdb[@list[j]].level,@list[j]]
    matched-types.sort (a,b) -> b.0 - a.0
    type = (matched-types.0 or [0,\String]).1
    return type

  resolve-value: (val) ->
    matched-types = [[0,\String]]
    for j from 0 til @list.length =>
      type = plotdb[@list[j]]
      if type.test(val) =>
        matched-types.push [plotdb[@list[j]].level,@list[j]]
    matched-types.sort (a,b) -> b.0 - a.0
    type = (matched-types.0 or [0,\String]).1
    return type

  resolve: (obj) ->
    if Array.isArray(obj) => return @resolve-array obj
    if typeof(obj) != \object => return @resolve-value obj
    {headers, rows, fields} = obj
    types = []
    for i from 0 til headers.length =>
      matched-types = []
      for j from 0 til @list.length =>
        type = plotdb[@list[j]]
        matched = true
        for k from 0 til rows.length =>
          if !type.test(rows[k][i]) =>
            matched = false
            break
        if matched => matched-types.push [plotdb[@list[j]].level,@list[j]]
      matched-types.sort (a,b) -> b.0 - a.0
      type = (matched-types.0 or [0,\String]).1
      types.push type
    return types
