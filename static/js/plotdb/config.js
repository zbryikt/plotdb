// Generated by LiveScript 1.3.1
plotdb.config = {
  palette: {
    name: "Palette",
    type: [plotdb.Palette],
    subtype: plotdb.Palette.subtype.Qualitative,
    'default': plotdb.Palette['default'],
    category: "Color"
  },
  colorNegative: {
    name: "Negative",
    type: [plotdb.Color],
    desc: "Color for negative values",
    'default': plotdb.Color.Negative,
    subtype: plotdb.Color.subtype.Negative,
    category: "Color"
  },
  colorPositive: {
    name: "Positive",
    type: [plotdb.Color],
    desc: "Color for positive values",
    'default': plotdb.Color.Positive,
    subtype: plotdb.Color.subtype.Positive,
    category: "Color"
  },
  colorNeutral: {
    name: "Neutral",
    type: [plotdb.Color],
    desc: "Color for neutral values",
    'default': plotdb.Color.Neutral,
    subtype: plotdb.Color.subtype.Neutral,
    category: "Color"
  },
  colorEmpty: {
    name: "Empty",
    type: [plotdb.Color],
    desc: "Color for 'no values'",
    'default': plotdb.Color.Empty,
    subtype: plotdb.Color.subtype.Empty,
    category: "Color"
  },
  colorPast: {
    name: "Past",
    type: [plotdb.Color],
    desc: "Color for values in past",
    subtype: plotdb.Color.subtype.Fade,
    category: "Color"
  },
  fill: {
    name: "Default Fill Color",
    type: [plotdb.Color],
    desc: "Default color for filling visual encoding",
    'default': '#e03f0e',
    category: "Color"
  },
  stroke: {
    name: "Default Stroke Color",
    type: [plotdb.Color],
    desc: "Default color for outline of visual encoding",
    'default': '#fff',
    category: "Color"
  },
  geoFill: {
    name: "Geoblock Fill Color",
    type: [plotdb.Color],
    desc: "Default color for filling geographic path",
    'default': '#eee',
    category: "Color"
  },
  geoStroke: {
    name: "Geoblock Stroke Color",
    type: [plotdb.Color],
    desc: "Default color for outline of geographic path",
    'default': '#919191',
    category: "Color"
  },
  hoverFill: {
    name: "Hovering Fill Color",
    type: [plotdb.Color],
    desc: "Fill color when hovering a visual encoding",
    'default': '#aaa',
    category: "Color"
  },
  hoverStroke: {
    name: "Hovering Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color when hovering a visual encoding",
    'default': '#fff',
    category: "Color"
  },
  connectFill: {
    name: "Line Fill Color",
    type: [plotdb.Color],
    desc: "Fill color between connection path of data node",
    'default': '#aaa',
    category: "Color"
  },
  connectStroke: {
    name: "Line Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color between connection path of data node",
    'default': '#fff',
    category: "Color"
  },
  padding: {
    name: "Padding",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  bubblePadding: {
    name: "Bubble Padding",
    type: [plotdb.Number],
    'default': 5,
    category: "Layout"
  },
  margin: {
    name: "Margin",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  barThick: {
    name: "Bar Thickness",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  lineThick: {
    name: "Line Thickness",
    type: [plotdb.Number],
    'default': 10,
    category: "Layout"
  },
  fontSize: {
    name: "Font Size",
    type: [plotdb.Number],
    'default': 12,
    category: "Text"
  },
  labelShadowSize: {
    name: "Label Shadow Size",
    type: [plotdb.Number],
    'default': 2,
    category: "Text"
  },
  xAxisLabel: {
    name: "X Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  yAxisLabel: {
    name: "Y Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  radialAxisLabel: {
    name: "Radial Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  angularAxisLabel: {
    name: "Angular Axis Label",
    type: [plotdb.String],
    category: "Text"
  },
  legendLabel: {
    name: "Legend Label",
    type: [plotdb.String],
    category: "Text"
  },
  otherLabel: {
    name: "Label for 'other'",
    type: [plotdb.String],
    'default': "Other",
    category: "Text"
  },
  showLabel: {
    name: "Show Data Label",
    type: [plotdb.Boolean],
    'default': false,
    category: "Switch"
  },
  showNode: {
    name: "Show Data Dot",
    type: [plotdb.Boolean],
    'default': true,
    category: "Switch"
  },
  labelPosition: {
    name: "Label Position",
    type: [plotdb.Choice(["in", "out"])],
    'default': "out",
    category: "Switch"
  },
  showPercent: {
    name: "Percentage in Label",
    type: [plotdb.Boolean],
    desc: "Show percentage in data label",
    'default': true,
    category: "Switch"
  },
  xScaleRange: {
    name: "Data Range in X axis",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in x axis",
    'default': [0, 1],
    category: "Value"
  },
  yScaleRange: {
    name: "Data Range in Y axis",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in y axis",
    'default': [0, 1],
    category: "Value"
  },
  rScaleRange: {
    name: "Data Range in Circle Radius",
    type: [plotdb.Range],
    desc: "Enforce chart rendering within this range, in circle radius",
    'default': [0, 1],
    category: "Value"
  },
  threshold: {
    name: "Threshold",
    type: [plotdb.Number],
    desc: "Diverging value split threshold",
    defaut: 0,
    category: "Value"
  },
  sort: {
    name: "Sort data",
    type: [plotdb.Choice("Ascending", "Descending", "None")],
    'default': "Descending",
    category: "Value"
  },
  emptyAs0: {
    name: "Empty as 0",
    type: [plotdb.Boolean],
    desc: "Treat undefined data as 0",
    'default': true,
    category: "Value"
  },
  otherLimit: {
    name: "Small Data Threshold",
    type: [plotdb.Number],
    desc: "Data smaller than this value will be clustered into one set of data",
    'default': 0,
    category: "Value"
  },
  axisInnerPadding: {
    name: "Axis Inner Tick length",
    type: [plotdb.Number],
    'default': 2,
    category: "Axis"
  },
  axisOutterPadding: {
    name: "Axis Outer Tick length",
    type: [plotdb.Number],
    'default': 2,
    category: "Axis"
  },
  showXAxis: {
    name: "Show X Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showYAxis: {
    name: "Show Y Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showRadialAxis: {
    name: "Show Radial Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  showAngularAxis: {
    name: "Show Angular Axis",
    type: [plotdb.Boolean],
    'default': true,
    category: "Axis"
  },
  xAxisTickSizeInner: {
    name: "X Axis Inner Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  xAxisTickSizeOuter: {
    name: "X Axis Outer Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  xAxisTickPadding: {
    name: "X Axis Tick Padding",
    type: [plotdb.Number],
    'default': 3,
    category: "Axis"
  },
  yAxisTickSizeInner: {
    name: "Y Axis Inner Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  yAxisTickSizeOuter: {
    name: "Y Axis Outer Tick Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Axis"
  },
  yAxisTickPadding: {
    name: "Y Axis Tick Padding",
    type: [plotdb.Number],
    'default': 3,
    category: "Axis"
  }
};