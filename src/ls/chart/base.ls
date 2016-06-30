plotdb = {}
plotdb <<< do
  Number: do
    default: 0
    name: \Number, test: (-> !isNaN(+it))
    level: 3
    parse: ->
      if typeof(it) == \string => it = parseFloat(it.replace(/,/g,'')) else it
    order: do
      Ascending: ((a,b) -> a - b)
      Descending: ((a,b) -> b - a)
      index: -> it
  Numstring: do
    default: ""
    name: \Numstring
    test: (->/\d+/.exec("#it"))
    parse: ->
      numbers = []
      num = it.split(/\.?[^0-9.]+/g)
      for j from 0 til num.length => if num[j] => numbers.push parseFloat(num[j])
      return {raw: it, numbers, len: numbers.length, toString: -> @raw}
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
  String: do
    default: ""
    name: \String, test: (-> true), level: 1, parse: -> it
  Month:
    default: \Jan
    name: \Month, level: 3
    values: do
      abbr: <[jan feb mar apr may jun jul aug sep oct nov dec]>
      en: <[january feburary march april may june july august september october november december]>
      zh: <[一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月]>
    parse: -> it
    test: ->
      value = it.toLowerCase!
      for k,v of @values =>
        idx = v.indexOf(value)
        if idx >=0 => return true
      return false
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
  Date:
    default: \1970/1/1
    name: \Date, level: 2
    match: do
      type4: /^(\d{1,2})[/-](\d{4})$/
    test: -> return if @parse it => true else false
    parse: ->
      d = new Date(it)
      if !(d instanceof Date) or isNaN(d.getTime!) =>
        ret = /^(\d{1,2})[/-](\d{4})$/.exec it
        if !ret => return null
        d = new Date(ret.2, parseInt(ret.1) - 1)
      return {raw: it, toString: (->@raw), parsed: d}
    order: do
      Ascending: (a,b) ->  return a.parsed.getTime! - b.parsed.getTime!
      Descending: (a,b) -> return b.parsed.getTime! - a.parsed.getTime!
      index: -> it.parsed.getTime!
  Choice: (v) ->
    return do
      default: ""
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
    Gray: \#cccccc
    Positive: \#3f7ab5
    Negative: \#d93510
    Neutral: \#cccccc
    subtype: do
      negative: "negative"
      positive: "positive"
      neutral: "neutral"
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
      linear: (pal, domain) ->
        c = pal.colors
        range = (c.filter(->it.keyword).map(->it.hex) ++ c.filter(->!it.keyword).map(->it.hex))
        if !domain => domain = c.map(->it.keyword).filter(->it?)
        d3.scale.linear!domain domain .range range
  Boolean:
    default: true
    name: \Boolean, level: 2,
    test: -> !!/^(true|false|1|0|yes|no)$/.exec(it)
    parse: ->
      if it and typeof(it) == typeof("") =>
        if /^(yes|true)$/.exec(it.trim!) => return true
        if /\d+/.exec(it.trim!) and it.trim! != "0" => return true
        return false
      if it => return true
      return false

plotdb <<< do
  Order: do
    default: (k,v,i) -> i
    name: \Order
    test: -> !!(@subtype.map((type)-> type.test it).filter(->it).0)
    subtype: [plotdb.Number, plotdb.Date, plotdb.Numstring, plotdb.Month]
    parse: -> it
    order: do
      Ascending: (a,b) -> if b > a => -1 else if b < a => 1 else 0
      Descending: (a,b) -> if b > a => 1 else if b < a => -1 else 0
    sort: (data, fieldname, is-ascending = true) ->
      field = data.map(->it[fieldname])
      types = @subtype.map(->it)
      for i from 0 til field.length
        for j from 0 til types.length
          if !types[j].test(field[i]) => types[j] = null
        types = types.filter(->it)
      type = types[0]
      if type => for i from 0 til data.length => data[i][fieldname] = type.parse data[i][fieldname]
      sorter = ((type or {}).order or @order)[if is-ascending => \Ascending else \Descending]
      data.sort((a,b)-> sorter(a[fieldname], b[fieldname]))
      #TODO if we can speed up further?

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

  data-from-dimension: (dimension) ->
    data = []
    len = Math.max.apply null,
      [v for k,v of dimension]
        .reduce(((a,b) -> (a) ++ (b.fields or [])),[])
        .filter(->it.data)
        .map(->it.data.length) ++ [0]
    for i from 0 til len
      ret = {}
      for k,v of dimension
        if v.multiple =>
          ret[k] = if v.[]fields.length => v.[]fields.map(->it.[]data[i]) else null
          v.field-name = v.[]fields.map -> it.name
        else
          ret[k] = if v.[]fields.0 => that.[]data[i] else null
          v.field-name = if v.[]fields.0 => that.name else null
        if ret[k] == null => # not bound dimension: we fill it with default
          type = (v.type.0 or plotdb.String)
          defval = plotdb[type.name].default
          value = if (typeof(defval) == \function) => defval(k,v,i) else type.default
          ret[k] = if v.multiple => [value] else value
        if v.type and v.type.0 and plotdb[v.type.0.name].parse =>
          parse = plotdb[v.type.0.name].parse
          if Array.isArray(ret[k]) =>
            for j from 0 til ret[k].length => ret[k][j] = parse ret[k][j]
          else ret[k] = parse ret[k]
        #if (v.type or []).filter(->it.name == \Number).length =>
        #  if Array.isArray(ret[k]) => ret[k] = ret[k].map(->parseFloat(it))
        #  else ret[k] = parseFloat(ret[k])
      data.push ret
    return data

  data-from-hash: (dimension, source) ->
    if !dimension or !source => return []
    if Array.isArray(source) => return source
    if typeof(source) == \function => source = source!
    for k,v of dimension => v.fields = (source[k] or [])
    return plotdb.chart.data-from-dimension dimension

  get-sample-data: (chart, dimension = null) ->
    plotdb.chart.data-from-hash (dimension or chart.dimension), chart.sample

  update-data: (chart) ->
    #TODO abstract so that sample data in renderer can also use this. we now just copy it.
    #TODO fields data load by demand
    chart.data = plotdb.chart.data-from-dimension chart.dimension

  update-assets: (chart, assets = []) ->
    ret = {}
    for file in assets =>
      raw = atob(file.content)
      array = new Uint8Array(raw.length)
      for idx from 0 til raw.length => array[idx] = raw.charCodeAt idx
      file.blob = new Blob([array],{type: file.type})
      file.url = URL.createObjectURL(file.blob)
      file.datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
      ret[file.name] = file
    chart.assets = ret

  update-config: (chart, config) ->
    for k,v of chart.config =>
      if !(config[k]?) => config[k] = v.default
      else if !(config[k].value?) => config[k] = (v or config[k]).default
      else config[k] = config[k].value
      type = (config[k].type or []).map(->it.name)
      if type.0 and plotdb[type.0].parse =>
        config[k] = plotdb[type.0].parse config[k]
      #if type.filter(->it == \Number).length => config[k] = parseFloat(config[k])

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

plotdb.d3 = {}
plotdb.d3.axis = do
  overlap: (axis-group, axis, font-size) ->
    range = axis.scale!range!
    selection = axis-group.selectAll(".tick text")
    if !selection.0.length => return
    min-width = ((range.1 - range.0) / selection.length)
    max-width = d3.max(selection.0.map (d) -> d.getBBox!width)
    overlap = maxWidth / minWidth
    if font-size and overlap <2
      selection.attr do
        transform: (d,i) ->
          [
            "translate(0,",
            if ((overlap>1) and (i % 2)) => font-size else 0,
            ")"
          ].join(" ")
      axisGroup.selectAll(".tick").style { opacity: 1 }
    else
      selection.attr {transform: "" }
      axisGroup.selectAll(".tick").style do
        opacity: (d,i) -> if (i % parseInt(overlap + 1)) => 0 else 1


plotdb.d3.popup = (root, sel, cb) ->
  popup = root.querySelector(\.pdb-popup)
  if !popup =>
    popup = d3.select root .append \div .attr class: 'pdb-popup float'
    popup.each (d,i) -> d3.select(@)
      ..append \div .attr class: \title
      ..append \div .attr class: \value
  else popup = d3.select popup
  sel
    ..on \mousemove, (d,i) ->
      [x,y] = [d3.event.clientX, d3.event.clientY]
      cb.call @,d,i,popup
      popup.style display: \block
      pbox = popup.0.0.getBoundingClientRect!
      rbox = root.getBoundingClientRect!
      x = x - pbox.width / 2
      y = y + 20
      if y > rbox.top + rbox.height - pbox.height - 50 => y = y - pbox.height - 40
      if x < 10 => x = 10
      if x > rbox.left + rbox.width - pbox.width - 10 => x = rbox.left + rbox.width - pbox.width - 10
      popup.style {top: "#{y}px", left: "#{x}px"}
    ..on \mouseout, ->
      if sel.hide-popup => clearTimeout sel.hide-popup
      sel.hide-popup = setTimeout (-> popup.style {display: \none}), 1000


plotdb.data = do
  sample: do
    country: ["Afghanistan","Albania","Antarctica","Algeria","American Samoa","Andorra","Angola","Antigua and Barbuda","Azerbaijan","Argentina","Australia","Austria","Bahamas","Bahrain","Bangladesh","Armenia","Barbados","Belgium","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","Belize","British Indian Ocean Territory","Solomon Islands","British Virgin Islands","Brunei","Bulgaria","Myanmar","Burundi","Belarus","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Sri Lanka","Chad","Chile","China","Taiwan","Christmas Island","Cocos Keeling Islands","Colombia","Comoros","Mayotte","Congo, Rep.","Congo, Dem. Rep.","Cook Islands","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Benin","Denmark","Dominica","Dominican Republic","Ecuador","El Salvador","Equatorial Guinea","Ethiopia","Eritrea","Estonia","Faroe Islands","Falkland Islands","SGSSI","Fiji","Finland","Åland Islands","France","French Guiana","French Polynesia","French Southern Territories","Djibouti","Gabon","Georgia","Gambia","Palestine","Germany","Ghana","Gibraltar","Kiribati","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guyana","Haiti","HIMI","Holy See","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Cote d'Ivoire","Jamaica","Japan","Kazakhstan","Jordan","Kenya","North Korea","South Korea","Kuwait","Kyrgyz Republic","Lao","Lebanon","Lesotho","Latvia","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Martinique","Mauritania","Mauritius","Mexico","Monaco","Mongolia","Moldova","Montenegro","Montserrat","Morocco","Mozambique","Oman","Namibia","Nauru","Nepal","Netherlands","Curaçao","Aruba","Sint Maarten","Bonaire, Sint Eustatius and Saba","New Caledonia","Vanuatu","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Norway","Northern Mariana Islands","United States Minor Outlying Islands","Micronesia, Fed. Sts.","Marshall Islands","Palau","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Guinea-Bissau","Timor-Leste","Puerto Rico","Qatar","Réunion","Romania","Russia","Rwanda","Saint Barthélemy","Saint Helena, Ascension and Tristan da Cunha","Saint Kitts and Nevis","Anguilla","St. Lucia","Saint Martin","Saint Pierre and Miquelon","St. Vincent and the Grenadines","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovak Republic","Vietnam","Slovenia","Somalia","South Africa","Zimbabwe","Spain","South Sudan","Sudan","Western Sahara","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syria","Tajikistan","Thailand","Togo","Tokelau","Tonga","Trinidad and Tobago","United Arab Emirates","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","Macedonia, FYR","Egypt","United Kingdom","Guernsey","Jersey","Isle of Man","Tanzania","United States","Virgin Islands","Burkina Faso","Uruguay","Uzbekistan","Venezuela","Wallis and Futuna","Samoa","Yemen","Zambia"]
    continent: <[Asia Europe America Oceania Australia Africa]>
    category: <[IT RD GM FIN LEGAL HR SALES BD]>
    name: <[
      James Joe Amelie Yale Doraemon Cindy David Frank Kim Ken Leland Mike Nick Oliver Randy
      Andy Angelica Zack Alfred Edward Thomas Percy Frankenstein Mary Toby Tim Timonthy Smith Karen
      Kenny Jim Victor Xavier Jimmy Bob Cynthia Dory Dolce Kirby Gabriel Gabby Watson Wade Wallace
      Gasper Karmen Ian Larry Rachel Parker Parry Eagle Falcon Hades Helen Sabrinaa Oscar Victoria
    ]>
    fruit: <[Apple Orange Banana Grape Longan Litchi Peach Guava Melon Pineapple Pomelo Durian Berry Pear]>
    weekday: <[Sunday Monday Tuesday Wednesday Thursday Friday Saturday]>
    month: <[January February March April May June July August September October November December]>
    generate: (dimension) ->
      ret = for i from 0 til parseInt(Math.random! * 10 + 10) =>
        node = {}
        for k,v of dimension =>
          if !v.type or !v.type.length => node[k] = @name[parseInt(Math.random! * @name.length)]
          else node[k] = parseInt(Math.random! * 8) + 2
        node
      return ret

(->
  helper = do
    get: (idx) -> @[idx % @length]
    order: (len) ->
      ret = new Array(len)
      for i from 0 til len => ret[i] = @[i % @length]
      ret
    rand: -> @[parseInt(Math.random! * @length)]
    rands: (len) ->
      ret = new Array(len)
      for i from 0 til len => ret[i] = @[parseInt(Math.random! * @length)]
      ret
  target = <[name country category fruit weekday month continent]>
  [k for k of helper].map((h)-> target.map (t)-> plotdb.data.sample[t][h] = helper[h])
)!

plotdb.data.sample <<< do
  crimean-war: {"month":{"name":"month","data":["01/04/1854","01/05/1854","01/06/1854","01/07/1854","01/08/1854","01/09/1854","01/10/1854","01/11/1854","01/12/1854","01/01/1855","01/02/1855","01/03/1855","01/04/1855","01/05/1855","01/06/1855","01/07/1855","01/08/1855","01/09/1855","01/10/1855","01/11/1855","01/12/1855","01/01/1856","01/02/1856","01/03/1856"]},"army size":{"name":"army size","data":[8571,23333,28333,28722,30246,30290,30643,29736,32779,32393,30919,30107,32252,35473,38863,42647,44614,47751,46852,37853,43217,44212,43485,46140]},"death number by zymotic":{"name":"death number by zymotic","data":[1,12,11,359,828,788,503,844,1725,2761,2120,1205,477,508,802,382,483,189,128,178,91,42,24,15]},"death number by wound":{"name":"death number by wound","data":[0,0,0,0,1,81,132,287,114,83,42,32,48,49,209,134,164,276,53,33,18,2,0,0]},"death number by other":{"name":"death number by other","data":[5,9,6,23,30,70,128,106,131,324,361,172,57,37,31,33,25,20,18,32,28,48,19,35]},"zymotic rate(‰)":{"name":"zymotic rate(‰)","data":[1.4,6.2,4.7,150,328.5,312.2,197,340.6,631.5,1022.8,822.8,480.3,177.5,171.8,247.6,107.5,129.9,47.5,32.8,56.4,25.3,11.4,6.6,3.9]},"wound rate(‰)":{"name":"wound rate(‰)","data":[0,0,0,0,0.4,32.1,51.7,115.8,41.7,30.7,16.3,12.8,17.9,16.6,64.5,37.7,44.1,69.4,13.6,10.5,5,0.5,0,0]},"other rate(‰)":{"name":"other rate(‰)","data":[7,4.6,2.5,9.6,11.9,27.7,50.1,42.8,48,120,140.1,68.6,21.2,12.5,9.6,9.3,6.7,5,4.6,10.1,7.8,13,5.2,9.1]}}
  life-expectancy: {"1985":{"name":"1985","data":["42.8","72.2","67.7","80","50","73.1","71.9","70.5","75.7","74","66.2","67.2","71.5","55.8","73.3","71.1","74.6","71.1","55","56","59.8","71.5","67.5","67.4","72.9","71.3","52","49.8","56.3","58.2","76.5","67.2","49.1","53.4","71.8","66.4","70.3","55.4","52.9","56.6","76.3","57.7","71.6","74.3","76.7","71.1","74.7","60.6","73.1","70.5","70","61.1","67.8","51.9","50.2","70.4","46.3","64.1","74.7","75.7","60.6","56.6","70.2","74.6","58.7","76","69.1","62.8","50.7","50.5","65","53.4","67.6","68.9","77.6","55.9","63.4","63.6","68.5","73.7","74.9","75.7","72.6","77.8","69.3","66.4","63.1","56.4","65.9","69.5","74.6","64.7","54.3","70.1","65.3","60.4","54.5","71.9","71.2","73.8","72","54.5","50.8","70.5","62.7","46.9","75.2","64","58.9","67.8","69.7","61.8","66","60.8","73.1","66.1","47","56.7","61.4","55.2","76.4","74.2","64.9","45","55.5","76.1","68.4","61.1","75.1","56","73.1","67.2","66","70.7","73.1","75","69.7","68.2","50.3","69.5","69.3","67.5","62.5","71.8","55.8","72.6","69.9","49.5","73.1","70.8","71.8","60.2","52.8","62.8","76.6","70.5","54.9","68.5","60","76.9","76.9","68.5","73","64.4","57.9","70.4","55.8","57.5","68","68.5","69.8","65.2","62","52.3","70","71.9","74.7","74.8","72.1","67","62.3","72.2","69.1","67.4","57.8","56.9","63.5","51.1"]},"2000":{"name":"2000","data":["51","74.2","73.2","82.7","52.6","73.9","74.3","71.4","79.7","78.2","68","70.3","73.6","65.8","74.3","68.2","77.8","69","59.2","63.9","67.6","75.2","51.6","71.9","75.5","71.7","53.3","47.5","60.9","55","79.3","70.1","46.7","52.4","77.2","71.5","72.5","60.2","52.5","52.6","77.7","52.8","74.7","75.9","79.1","75","76.9","59.6","73.3","72.7","73.2","68.9","72.9","52.4","49.3","70.1","52.5","64.2","77.8","79.1","58","60","72.3","78.1","60.2","78","70.5","68.5","55.6","51.7","64.4","58.6","68.8","71.8","79.9","61.1","68.3","71.2","69.1","76.7","78.8","79.6","72.7","81.1","73.1","63.6","57.4","59.5","63.2","76.3","77.5","65.8","59.5","70.1","76.2","49.8","55.9","74.6","72","78.2","73.9","60.5","46.3","73.8","72.6","51.1","79.7","63.8","61.8","71","75.1","64.5","69.3","61.4","72","71.3","53.6","61.4","55","64.9","78.1","78.5","73.9","53","55.8","78.7","73.7","62.6","76.9","56.9","74.1","74.3","69","73.8","76.7","77.2","70.8","65.4","50","72","69.8","69.9","65.3","76.1","60","74.7","70.9","52.2","78.6","73.3","75.8","61.7","54.3","57.1","79.3","72.4","64.4","68.8","48.7","79.7","80","73.8","76","66.3","54.8","71.3","63.6","59","69.1","69.4","75","71.5","63.1","50","67.5","73.8","77.8","77.1","74.6","67.4","63","74.3","73.5","72.6","63.5","45.7","50.8","54.1"]},"2015":{"name":"2015","data":["57.63","76","76.5","84.1","61","75.2","76.2","74.4","81.8","81","72.9","72.3","79.2","70.1","75.8","70.4","80.4","70","65.5","70.2","72.3","77.9","66.4","75.6","78.7","74.9","62.8","60.4","68.4","59.5","81.7","74.6","53.8","57.7","79.3","76.9","75.8","64.1","58.3","61.9","80","60.33","78","78.5","82.6","78.6","80.1","64.63","74.6","73.8","75.2","71.3","74.1","60.63","62.9","76.8","63.6","66.3","80.8","81.9","60.53","65.1","73.3","81.1","65.5","79.8","71.7","73.1","60.8","53.4","64.4","65.3","72.4","76.2","82.8","66.8","70.9","78.5","72.1","80.4","82.4","82.1","75.5","83.5","78.3","68.2","66.63","62.4","71.4","80.7","80.7","69","66.4","75.7","78.5","48.5","63.9","76.2","75.4","81.1","77","64.7","60.22","75.1","79.5","57.6","82.1","65.1","65.7","73.9","74.5","67","72.7","65.3","75.8","74.7","56.4","67.9","61","71.2","80.6","80.6","76.8","62.2","61.33","81.6","75.7","66.5","78.2","60.6","73.9","77.5","70.2","77.3","79.8","82","76.8","73.13","66.53","74.5","72.9","72.2","68.8","78.1","66.1","78.1","73.7","58.5","82.1","76.4","80.2","64.1","58.7","63.72","81.7","76.5","69.5","70.5","51.5","82","82.9","70.26","79.7","71","63.43","75.1","72.4","64.23","70.5","71.4","77.3","76.5","67.9","60.8","72.1","76.6","81.4","79.1","77.3","70.1","65","75.8","75.2","76.5","67.6","58.96","60.01","58"]},"Country":{"name":"Country","data":["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Dem. Rep.","Congo, Rep.","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","North Korea","South Korea","Kuwait","Kyrgyz Republic","Lao","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macedonia, FYR","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia, Fed. Sts.","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","St. Lucia","St. Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovak Republic","Slovenia","Solomon Islands","Somalia","South Africa","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","West Bank and Gaza","Vietnam","Yemen","Zambia","Zimbabwe","South Sudan"]},"Continent":{"name":"Continent","data":["Asia","Europe","Africa","Europe","Africa","North America","South America","Europe","Oceania","Europe","Europe","North America","Asia","Asia","North America","Europe","Europe","North America","Africa","Asia","South America","Europe","Africa","South America","Asia","Europe","Africa","Africa","Asia","Africa","North America","Africa","Africa","Africa","South America","Asia","South America","Africa","Africa","Africa","North America","Africa","Europe","North America","Europe","Europe","Europe","Africa","North America","North America","South America","Africa","North America","Africa","Africa","Europe","Africa","Oceania","Europe","Europe","Africa","Africa","Europe","Europe","Africa","Europe","North America","North America","Africa","Africa","South America","North America","North America","Europe","Europe","Asia","Asia","Asia","Asia","Europe","Asia","Europe","North America","Asia","Asia","Asia","Africa","Oceania","Asia","Asia","Asia","Asia","Asia","Europe","Asia","Africa","Africa","Africa","Europe","Europe","Europe","Africa","Africa","Asia","Asia","Africa","Europe","Oceania","Africa","Africa","North America","Oceania","Europe","Asia","Europe","Africa","Africa","Asia","Africa","Asia","Europe","Oceania","North America","Africa","Africa","Europe","Asia","Asia","North America","Oceania","South America","South America","Asia","Europe","Europe","Asia","Europe","Asia","Africa","North America","North America","Oceania","Africa","Asia","Africa","Europe","Africa","Africa","Asia","Europe","Europe","Oceania","Africa","Africa","Europe","Asia","Africa","South America","Africa","Europe","Europe","Asia","Asia","Asia","Africa","Asia","Asia","Africa","Oceania","North America","Africa","Asia","Asia","Africa","Europe","Asia","Europe","North America","South America","Asia","Oceania","South America","Asia","Asia","Asia","Africa","Africa","Africa"]}}
