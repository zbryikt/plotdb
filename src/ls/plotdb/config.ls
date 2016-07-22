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
  # Color Configuration
  palette: do
    name: "Palette"
    type: [plotdb.Palette]
    subtype: plotdb.Palette.subtype.Qualitative
    default: plotdb.Palette.default
    category: "Color"

  colorNegative: do
    name: "Negative"
    type: [plotdb.Color]
    desc: "Color for negative values"
    default: plotdb.Color.Negative
    subtype: plotdb.Color.subtype.Negative
    category: "Color"

  colorPositive: do
    name: "Positive"
    type: [plotdb.Color]
    desc: "Color for positive values"
    default: plotdb.Color.Positive
    subtype: plotdb.Color.subtype.Positive
    category: "Color"

  colorNeutral: do
    name: "Neutral"
    type: [plotdb.Color]
    desc: "Color for neutral values"
    default: plotdb.Color.Neutral
    subtype: plotdb.Color.subtype.Neutral
    category: "Color"

  colorEmpty: do
    name: "Empty"
    type: [plotdb.Color]
    desc: "Color for 'no values'"
    default: plotdb.Color.Empty
    subtype: plotdb.Color.subtype.Empty
    category: "Color"

  colorPast: do
    name: "Past"
    type: [plotdb.Color]
    desc: "Color for values in past"
    subtype: plotdb.Color.subtype.Fade
    category: "Color"

  fill: do
    name: "Default Fill Color"
    type: [plotdb.Color]
    desc: "Default color for filling visual encoding"
    default: \#e03f0e
    category: "Color"

  stroke: do
    name: "Default Stroke Color"
    type: [plotdb.Color]
    desc: "Default color for outline of visual encoding"
    default: \#fff
    category: "Color"

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
    desc: "Fill color when hovering a visual encoding"
    default: \#aaa
    category: "Color"

  hoverStroke: do
    name: "Hovering Stroke Color"
    type: [plotdb.Color]
    desc: "Stroke color when hovering a visual encoding"
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
    default: \#fff
    category: "Color"

  # Layout Configuration
  padding: do
    name: "Padding"
    type: [plotdb.Number]
    default: 10
    category: "Layout"

  bubblePadding: do
    name: "Bubble Padding"
    type: [plotdb.Number]
    default: 5
    category: "Layout"

  margin: do
    name: "Margin"
    type: [plotdb.Number]
    default: 10
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

  # Text
  fontSize: do
    name: "Font Size"
    type: [plotdb.Number]
    default: 13
    category: "Text"

  labelShadowSize: do
    name: "Label Shadow Size"
    type: [plotdb.Number]
    default: 2
    category: "Text"

  xAxisLabel: do
    name: "X Axis Label"
    type: [plotdb.String]
    category: "Text"

  yAxisLabel: do
    name: "Y Axis Label"
    type: [plotdb.String]
    category: "Text"

  radialAxisLabel: do
    name: "Radial Axis Label"
    type: [plotdb.String]
    category: "Text"

  angularAxisLabel: do
    name: "Angular Axis Label"
    type: [plotdb.String]
    category: "Text"

  legendLabel: do
    name: "Legend Label"
    type: [plotdb.String]
    category: "Text"

  otherLabel: do
    name: "Label for 'other'"
    type: [plotdb.String]
    default: "Other"
    category: "Text"

  #Switch
  showLabel: do
    name: "Show Data Label"
    type: [plotdb.Boolean]
    default: false
    category: "Switch"

  showNode: do
    name: "Show Data Dot"
    type: [plotdb.Boolean]
    default: true
    category: "Switch"

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
    name: "Show X Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Axis"

  showYAxis: do
    name: "Show Y Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Axis"

  showRadialAxis: do
    name: "Show Radial Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Axis"

  showAngularAxis: do
    name: "Show Angular Axis"
    type: [plotdb.Boolean]
    default: true
    category: "Axis"

  xAxisTickSizeInner: do
    name: "X Axis Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Axis"

  xAxisTickSizeOuter: do
    name: "X Axis Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Axis"

  xAxisTickPadding: do
    name: "X Axis Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "Axis"

  yAxisTickSizeInner: do
    name: "Y Axis Inner Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Axis"

  yAxisTickSizeOuter: do
    name: "Y Axis Outer Tick Size"
    type: [plotdb.Number]
    default: 6
    category: "Axis"

  yAxisTickPadding: do
    name: "Y Axis Tick Padding"
    type: [plotdb.Number]
    default: 3
    category: "Axis"
