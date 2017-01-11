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
  language: do
    name: "Language"
    type: [plotdb.Choice([{name: "正體中文", value: "zh-tw"}, {name: "English", value: "en"}])]
    default: {name: "English", value: "en"}
    category: "Global Settings"
    rebindOnChange: true
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
  duration: do
    name: "Animation Duration"
    type: [plotdb.Number]
    default: 1.5
    desc: "Animation Duration, in second (e.g., 1.5)"
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
  textFillInverse: do
    name: "Text Color (Inverse)"
    type: [plotdb.Color]
    default: '#ffffff'
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

  popupShow: do
    name: "show Popup"
    desc: "show Popup when user hovers over elements"
    type: [plotdb.Boolean]
    default: true
    category: "Popup"
    rebindOnChange: true

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
    name: "Fill Color"
    type: [plotdb.Color]
    desc: "Default color for filling geographic path"
    default: \#eee
    category: "Geography"

  geoStroke: do
    name: "Stroke Color"
    type: [plotdb.Color]
    desc: "Default color for outline of geographic path"
    default: \#919191
    category: "Geography"

  geoStrokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    desc: "geographic path outline width"
    default: \1
    category: "Geography"

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
    name: "Fill Color"
    type: [plotdb.Color]
    desc: "Fill color between connection path of data node"
    default: \#aaa
    category: "Line"

  connectStroke: do
    name: "Stroke Color"
    type: [plotdb.Color]
    desc: "Stroke color between connection path of data node"
    default: \#aaa
    category: "Line"

  connectStrokeWidth: do
    name: "Stroke width"
    type: [plotdb.Number]
    desc: "Stroke size between connection path of data node"
    default: 2
    category: "Line"

  connectDashArray: do
    name: "Dash Array"
    type: [plotdb.String]
    desc: "SVG style dash array. '2 4' means 2px line and 4px space."
    default: "2 2"
    category: "Line"

  gridShow: do
    name: "Show Grid"
    type: [plotdb.Boolean]
    default: true
    category: "Grid"

  gridBackground: do
    name: "Background"
    type: [plotdb.Color]
    default: "rgba(255,255,255,0)"
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

  gridFrameStroke: do
    name: "Frame Color"
    type: [plotdb.Color]
    default: \#ccc
    category: \Grid

  gridFrameStrokeWidth: do
    name: "Frame Width"
    type: [plotdb.Number]
    default: 3
    category: \Grid

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

  bubbleSizeMin: do
    name: "Min Size"
    type: [plotdb.Number]
    default: 0
    category: "Bubble"

  bubbleSizeMax: do
    name: "Max Size"
    type: [plotdb.Number]
    default: 20
    category: "Bubble"

  bubbleFill: do
    name: "Fill Color"
    type: [plotdb.Color]
    default: \#ffaaaa
    category: "Bubble"

  bubbleStroke: do
    name: "Stroke Color"
    type: [plotdb.Color]
    default: \#c01d1d
    category: "Bubble"

  bubbleStrokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    default: \1
    category: "Bubble"

  bubblePadding: do
    name: "Bubble Padding"
    type: [plotdb.Number]
    default: 5
    category: "Bubble"

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

  legendShow: do
    name: "Show Legend"
    type: [plotdb.Boolean]
    default: true
    category: "Legend"

  legendLabel: do
    name: "Label"
    type: [plotdb.String]
    category: "Legend"

  legendPosition: do
    name: "Position"
    type: [plotdb.Choice(<[top left right bottom]>)]
    default: "right"
    category: "Legend"

  otherLabel: do
    name: "Label for 'other'"
    type: [plotdb.String]
    default: "Other"
    category: "Label"

  showLabel: do #legacy. backward compatibility
    name: "Show Data Label"
    type: [plotdb.Boolean]
    default: false
    category: "Label"

  labelShadowSize: do
    name: "Label Shadow Size"
    type: [plotdb.Number]
    default: 2
    category: "Label"

  labelShow: do
    name: "Show Data Label"
    type: [plotdb.Boolean]
    default: false
    category: "Label"

  labelShowValue: do
    name: "Show Value"
    type: [plotdb.Boolean]
    desc: "Show value labels in chart"
    default: false
    rebindOnChange: true
    category: "Label"

  labelShowOverflow: do
    name: "Show Overflow Label"
    type: [plotdb.Boolean]
    desc: "Show all label, even if they are too long."
    default: false
    category: "Label"

  nodeShow: do
    name: "Show Data Dot"
    type: [plotdb.Boolean]
    default: true
    category: "Dot"

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
    category: "Label"

  showPercent: do
    name: "Percentage in Label"
    type: [plotdb.Boolean]
    desc: "Show percentage in data label"
    default: true
    category: "Label"

  #Value
  unit: do
    name: "Unit"
    type: [plotdb.String]
    default: ""
    desc: "Unit of value"
    category: "Value"
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
    desc: "data larger than this value will be treated as positive, vice versa."
    default: 0
    category: "Value"

  sort: do
    name: "Sort data"
    type: [plotdb.Choice(<[Ascending Descending None]>)]
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
    category: "Line"

  strokeWidth: do
    name: "Stroke Width"
    type: [plotdb.Number]
    desc: "Default Stroke width"
    default: \2
    category: "Global Settings"

  strokeDashArray: do
    name: "Stroke Dash Style"
    type: [plotdb.Number]
    default: \2
    desc: "SVG style dash array. '2 4' means 2px line and 4px space."
    category: "Global Settings"

  zeroBaseline: do # legacy
    name: "Zero Baseline"
    desc: "y Axis starts with zero"
    type: [plotdb.Boolean]
    default: true
    rebindOnChange: true
    category: "Y Axis"

  yAxisZeroBaseline: do
    name: "Zero Baseline"
    desc: "y Axis starts with zero"
    type: [plotdb.Boolean]
    default: true
    rebindOnChange: true
    category: "Y Axis"

<[X Y Radial Angular]>.forEach (n) ->
  p = "#{n.charAt(0).toLowerCase!}Axis"
  c = "#{n} Axis"
  b = [plotdb.Boolean]
  n = [plotdb.Number]
  v = [plotdb.Color]
  plotdb.config["#{p}Show"] = name: "Show Axis", type: b, default: true, category: c
  plotdb.config["#{p}ShowDomain"] = name: "Show Basline", type: b, default: true, category: c
  plotdb.config["#{p}TickSizeInner"] = name: "Inner Tick Size", type: n, default: 4, category: c
  plotdb.config["#{p}TickSizeOuter"] = name: "Outer Tick Size", type: n, default: 0, category: c
  plotdb.config["#{p}TickPadding"] = name: "Tick Padding", type: n, default: 4, category: c
  plotdb.config["#{p}Stroke"] = name: "Stroke Color", type: v, default: "#000", category: c
  plotdb.config["#{p}Label"] = name: "Label", type: [plotdb.String], default: "", category: c
  plotdb.config["#{p}TickCount"] = name: "Tick Count", type: n, default: 6, category: c, desc: "Hint on number of tick. Actual number will be decided by program"
  plotdb.config["#{p}LabelPosition"] = name: "Label Position", type: [plotdb.Choice(['in','center'])], default: "center", category: c
  plotdb.config["#{p}TickDirection"] = name: "Tick Direction", type: [plotdb.Choice(<[vertical horizontal]>)], default: "horizontal", category: c
  plotdb.config["#{p}HandleOverlap"] = name: "Overlap Ticks", type: [plotdb.Choice(<[none hidden offset]>)], default: "hidden", category: c, desc: "How should overlapped ticks be taken care?"

plotdb.config["yAxisHandleOverlap"].type = [plotdb.Choice(<[none hidden]>)]
plotdb.config <<< do
  yAxisPosition: do
    name: "Axis Position"
    type: [plotdb.Choice(["left", "right"])]
    default: \left
    category: "Y Axis"
  xAxisPosition: do
    name: "Axis Position"
    type: [plotdb.Choice(["top", "bottom"])]
    default: \bottom
    category: "X Axis"
