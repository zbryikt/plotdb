#TODO
# a total rename, e.g., 
# base -> colorNeutral
# oldValue -> colorPast
# newValue -> colorDefault
# pointColor -> colorDefaultFill
# barHeight -> barThick (parallel bar 1052)
# 圖表自訂者:
# colorForMax -> 圖表自訂
# good,satisfactory, bad, performance ( bar colors ) ( bullet chart, 975)
# ringSize (circular bubbles 972)
# overlapped
# maxIconCount, maxIconWidth
# title (hierarchy bubbles)
# labels (scale, legend)
# previous value label, next value label
# cat in bubble
# xCriteria, yCriteria

# Candidate
# Axis Tick Number

# Category
# Color / Axis / Value / Layout / Label
plotdb.config = do
  # Global Configuration
  fontFamily: do
    name: "Font"
    type: [plotdb.String]
    default: "Arial"
    category: "Global Settings"
  fontSize: do
    name: "Font Size"
    type: [plotdb.Number]
    default: 13
    category: "Global Settings"
  background: do
    name: "Background"
    type: [plotdb.Color]
    default: '#ffffff'
    category: "Global Settings"
  textFill: do
    name: "Text Color"
    type: [plotdb.Color]
    default: '#000000'
    category: "Global Settings"
  margin: do
    name: "Margin"
    type: [plotdb.Number]
    default: 10
    category: "Global Settings"
  aspectRatio: do
    name: "Aspect Ratio"
    type: [plotdb.Boolean]
    default: true
    category: "Layout"

  boxRoundness: do
    name: "Block Roundness"
    type: [plotdb.Number]
    default: 0
    category: "Global Settings"
  # Color Configuration
  palette: do
    name: "Palette"
    type: [plotdb.Palette]
    subtype: plotdb.Palette.subtype.Qualitative
    default: {colors:[{hex:'#f4502a'},{hex:'#f1c227'},{hex:'#008a6d'},{hex:'#00acdb'},{hex:'#0064a8'}]}
    category: "Global Settings"

  colorNegative: do
    name: "Negative"
    type: [plotdb.Color]
    desc: "Color for negative values"
    default: plotdb.Color.Negative
    subtype: plotdb.Color.subtype.Negative
    category: "Global Settings"

  colorPositive: do
    name: "Positive"
    type: [plotdb.Color]
    desc: "Color for positive values"
    default: plotdb.Color.Positive
    subtype: plotdb.Color.subtype.Positive
    category: "Global Settings"

  colorNeutral: do
    name: "Neutral"
    type: [plotdb.Color]
    desc: "Color for neutral values"
    default: plotdb.Color.Neutral
    subtype: plotdb.Color.subtype.Neutral
    category: "Global Settings"

  colorEmpty: do
    name: "Empty"
    type: [plotdb.Color]
    desc: "Color for 'no values'"
    default: plotdb.Color.Empty
    subtype: plotdb.Color.subtype.Empty
    category: "Global Settings"

  colorPast: do
    name: "Past"
    type: [plotdb.Color]
    desc: "Color for values in past"
    subtype: plotdb.Color.subtype.Fade
    category: "Global Settings"

  fill: do
    name: "Fill"
    type: [plotdb.Color]
    default: \#e03f0e
    category: "Global Settings"

  fillOpacity: do
    name: "Fill Opacity"
    type: [plotdb.Number]
    default: 0.6
    category: "Global Settings"

  stroke: do
    name: "Stroke"
    type: [plotdb.Color]
    desc: "Stroke Color"
    default: \#999
    category: "Global Settings"

  geoFill: do
    name: "Geoblock Fill Color"
    type: [plotdb.Color]
    desc: "Default color for filling geographic path"
    default: \#eee
    category: "Color"

  geoStroke: do
    name: "Geoblock Stroke Color"
    type: [plotdb.Color]
    desc: "Default color for outline of geographic path"
    default: \#919191
    category: "Color"

  hoverFill: do
    name: "Hovering Fill Color"
    type: [plotdb.Color]
    desc: "Fill color when hovering element"
    default: \#aaa
    category: "Color"

  hoverStroke: do
    name: "Hovering Stroke Color"
    type: [plotdb.Color]
    desc: "Stroke color when hovering element"
    default: \#fff
    category: "Color"

  connectFill: do
    name: "Line Fill Color"
    type: [plotdb.Color]
    desc: "Fill color between connection path of data node"
    default: \#aaa
    category: "Color"

  connectStroke: do
    name: "Line Stroke Color"
    type: [plotdb.Color]
    desc: "Stroke color between connection path of data node"
    default: \#aaa
    category: "Color"

  gridShow: do
    name: "Show Grid"
    type: [plotdb.Boolean]
    default: true
    category: "Grid"

  gridStroke: do
    name: "Color"
    type: [plotdb.Color]
    default: \#ccc
    category: "Grid"

  gridStrokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    default: 1
    category: "Grid"

  gridDashArray: do
    name: "Dash Style"
    type: [plotdb.String]
    default: "2 4"
    category: "Grid"
    desc: "SVG style dash array. '2 4' means 2px line and 4px space."

  # Layout Configuration
  padding: do
    name: "Padding"
    type: [plotdb.Number]
    default: 10
    category: "Global Settings"

  bubblePadding: do
    name: "Bubble Padding"
    type: [plotdb.Number]
    default: 5
    category: "Layout"

  #TBD
  barThick: do
    name: "Bar Thickness"
    type: [plotdb.Number]
    default: 10
    category: "Layout"

  #TBD
  lineThick: do
    name: "Line Thickness"
    type: [plotdb.Number]
    default: 10
    category: "Layout"

  labelShadowSize: do
    name: "Label Shadow Size"
    type: [plotdb.Number]
    default: 2
    category: "Text"

  legendShow: do
    name: "Show Legend"
    type: [plotdb.Boolean]
    default: true
    category: "Legend"

  legendLabel: do
    name: "Legend Label"
    type: [plotdb.String]
    category: "Legend"

  otherLabel: do
    name: "Label for 'other'"
    type: [plotdb.String]
    default: "Other"
    category: "Text"

  showLabel: do #legacy. backward compatibility
    name: "Show Data Label"
    type: [plotdb.Boolean]
    default: false
    category: "Label"

  labelShow: do
    name: "Show Data Label"
    type: [plotdb.Boolean]
    default: false
    category: "Label"

  showNode: do
    name: "Show Data Dot"
    type: [plotdb.Boolean]
    default: true
    category: "Switch"

  nodeSize: do
    name: "Dot Size"
    type: [plotdb.Number]
    default: 6
    category: "Dot"

  nodeFill: do
    name: "Fill Color"
    type: [plotdb.Color]
    desc: "fill Dot with this color"
    default: \#eee
    category: "Dot"

  nodeStroke: do
    name: "Stroke Color"
    type: [plotdb.Color]
    desc: "draw Dot outline with this color"
    default: \#919191
    category: "Dot"

  nodeStrokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    default: \1
    category: "Dot"

  labelPosition: do
    name: "Label Position"
    type: [plotdb.Choice(["in","out"])]
    default: "out"
    category: "Switch"

  showPercent: do
    name: "Percentage in Label"
    type: [plotdb.Boolean]
    desc: "Show percentage in data label"
    default: true
    category: "Switch"

  #Value
  xScaleRange: do
    name: "Data Range in X axis"
    type: [plotdb.Range]
    desc: "Enforce chart rendering within this range, in x axis"
    default: [0,1]
    category: "Value"

  yScaleRange: do
    name: "Data Range in Y axis"
    type: [plotdb.Range]
    desc: "Enforce chart rendering within this range, in y axis"
    default: [0,1]
    category: "Value"

  rScaleRange: do
    name: "Data Range in Circle Radius"
    type: [plotdb.Range]
    desc: "Enforce chart rendering within this range, in circle radius"
    default: [0,1]
    category: "Value"

  threshold: do
    name: "Threshold"
    type: [plotdb.Number]
    desc: "Diverging value split threshold"
    defaut: 0
    category: "Value"

  sort: do
    name: "Sort data"
    type: [plotdb.Choice("Ascending","Descending","None")]
    default: "Descending"
    category: "Value"
    
  emptyAs0: do
    name: "Empty as 0"
    type: [plotdb.Boolean]
    desc: "Treat undefined data as 0"
    default: true
    category: "Value"

  otherLimit: do
    name: "Small Data Threshold"
    type: [plotdb.Number]
    desc: "Data smaller than this value will be clustered into one set of data"
    default: 0
    category: "Value"
  /*
  #Axis
  axisInnerPadding: do
    name: "Axis Inner Tick length"
    type: [plotdb.Number]
    default: 2
    category: "Axis"

  axisOutterPadding: do
    name: "Axis Outer Tick length"
    type: [plotdb.Number]
    default: 2
    category: "Axis"

  showXAxis: do
    name: "Show Axis"
    type: [plotdb.Boolean]
    default: true
    category: "X Axis"

  xAxisShowDomain: do
    name: "Show Baseline"
    default: true
    category: "X Axis"

  xAxisTickSizeInner: do
    name: "Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "X Axis"

  xAxisTickSizeOuter: do
    name: "Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "X Axis"

  xAxisTickPadding: do
    name: "Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "X Axis"

  showYAxis: do
    name: "Show Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Y Axis"

  yAxisShowDomain: do
    name: "Show Baseline"
    default: true
    category: "Y Axis"

  yAxisTickSizeInner: do
    name: "Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Y Axis"

  yAxisTickSizeOuter: do
    name: "Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Y Axis"

  yAxisTickPadding: do
    name: "Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "Y Axis"

  showRadialAxis: do
    name: "Show Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Radial Axis"

  rAxisShowDomain: do
    name: "Show Baseline"
    default: true
    category: "Radial Axis"

  rAxisTickSizeInner: do
    name: "Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Radial Axis"

  rAxisTickSizeOuter: do
    name: "Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Radial Axis"

  rAxisTickPadding: do
    name: "Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "Radial Axis"

  showAngularAxis: do
    name: "Show Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Angular Axis"

  aAxisShowDomain: do
    name: "Show Baseline"
    default: true
    category: "Angular Axis"

  aAxisTickSizeInner: do
    name: "Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Angular Axis"

  aAxisTickSizeOuter: do
    name: "Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Angular Axis"

  aAxisTickPadding: do
    name: "Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "Angular Axis"
  */
  lineSmoothing: do
    name: "Line Smoothing"
    default: "linear"
    type: [plotdb.Choice(<[
      linear step step-before step-after basis bundle cardinal monotone
    ]>)]
    category: "Style"

  strokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    desc: "Default Stroke width"
    default: \2
    category: "Global Settings"

<[X Y Radial Angular]>.forEach (n) ->
  p = "#{n.charAt(0).toLowerCase!}Axis"
  c = "#{n} Axis"
  b = [plotdb.Boolean]
  n = [plotdb.Number]
  plotdb.config["#{p}Show"] = name: "Show Axis", type: b, default: true, category: c
  plotdb.config["#{p}ShowDomain"] = name: "Show Basline", type: b, default: true, category: c
  plotdb.config["#{p}TickSizeInner"] = name: "Inner Tick Size", type: n, default: 4, category: c
  plotdb.config["#{p}TickSizeOuter"] = name: "Outer Tick Size", type: n, default: 0, category: c
  plotdb.config["#{p}TickPadding"] = name: "Tick Padding", type: n, default: 4, category: c
  plotdb.config["#{p}Label"] = name: "Label", type: [plotdb.String], default: "", category: c
  plotdb.config["#{p}TickCount"] = name: "Tick Count", type: n, default: 6, category: c, desc: "Hint on number of tick. Actual number will be decided by program"
  plotdb.config["#{p}LabelPosition"] = name: "Label Position", type: [plotdb.Choice(['in','center'])], default: "center", category: c
