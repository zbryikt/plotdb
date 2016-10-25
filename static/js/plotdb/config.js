// Generated by LiveScript 1.3.1
plotdb.config = {
  fontFamily: {
    name: "Font",
    type: [plotdb.String],
    'default': "Arial",
    category: "Global Settings"
  },
  fontSize: {
    name: "Font Size",
    type: [plotdb.Number],
    'default': 13,
    category: "Global Settings"
  },
  duration: {
    name: "Animation Duration",
    type: [plotdb.Number],
    'default': 1.5,
    desc: "Animation Duration, in second (e.g., 1.5)",
    category: "Global Settings"
  },
  background: {
    name: "Background",
    type: [plotdb.Color],
    'default': '#ffffff',
    category: "Global Settings"
  },
  textFill: {
    name: "Text Color",
    type: [plotdb.Color],
    'default': '#000000',
    category: "Global Settings"
  },
  margin: {
    name: "Margin",
    type: [plotdb.Number],
    'default': 10,
    category: "Global Settings"
  },
  aspectRatio: {
    name: "Aspect Ratio",
    type: [plotdb.Boolean],
    'default': true,
    category: "Layout"
  },
  zeroBaseline: {
    name: "Zero Baseline",
    desc: "y Axis starts with zero",
    type: [plotdb.Boolean],
    'default': true,
    category: "Global Settings"
  },
  popupShow: {
    name: "show Popup",
    desc: "show Popup when user hovers over elements",
    type: [plotdb.Boolean],
    'default': true,
    category: "Popup",
    rebindOnChange: true
  },
  boxRoundness: {
    name: "Block Roundness",
    type: [plotdb.Number],
    'default': 0,
    category: "Global Settings"
  },
  palette: {
    name: "Palette",
    type: [plotdb.Palette],
    subtype: plotdb.Palette.subtype.Qualitative,
    'default': {
      colors: [
        {
          hex: '#f4502a'
        }, {
          hex: '#f1c227'
        }, {
          hex: '#008a6d'
        }, {
          hex: '#00acdb'
        }, {
          hex: '#0064a8'
        }
      ]
    },
    category: "Global Settings"
  },
  colorNegative: {
    name: "Negative",
    type: [plotdb.Color],
    desc: "Color for negative values",
    'default': plotdb.Color.Negative,
    subtype: plotdb.Color.subtype.Negative,
    category: "Global Settings"
  },
  colorPositive: {
    name: "Positive",
    type: [plotdb.Color],
    desc: "Color for positive values",
    'default': plotdb.Color.Positive,
    subtype: plotdb.Color.subtype.Positive,
    category: "Global Settings"
  },
  colorNeutral: {
    name: "Neutral",
    type: [plotdb.Color],
    desc: "Color for neutral values",
    'default': plotdb.Color.Neutral,
    subtype: plotdb.Color.subtype.Neutral,
    category: "Global Settings"
  },
  colorEmpty: {
    name: "Empty",
    type: [plotdb.Color],
    desc: "Color for 'no values'",
    'default': plotdb.Color.Empty,
    subtype: plotdb.Color.subtype.Empty,
    category: "Global Settings"
  },
  colorPast: {
    name: "Past",
    type: [plotdb.Color],
    desc: "Color for values in past",
    subtype: plotdb.Color.subtype.Fade,
    category: "Global Settings"
  },
  fill: {
    name: "Fill",
    type: [plotdb.Color],
    'default': '#e03f0e',
    category: "Global Settings"
  },
  fillOpacity: {
    name: "Fill Opacity",
    type: [plotdb.Number],
    'default': 0.6,
    category: "Global Settings"
  },
  stroke: {
    name: "Stroke",
    type: [plotdb.Color],
    desc: "Stroke Color",
    'default': '#999',
    category: "Global Settings"
  },
  geoFill: {
    name: "Fill Color",
    type: [plotdb.Color],
    desc: "Default color for filling geographic path",
    'default': '#eee',
    category: "Geography"
  },
  geoStroke: {
    name: "Stroke Color",
    type: [plotdb.Color],
    desc: "Default color for outline of geographic path",
    'default': '#919191',
    category: "Geography"
  },
  geoStrokeWidth: {
    name: "Stroke Width",
    type: [plotdb.Number],
    desc: "geographic path outline width",
    'default': '1',
    category: "Geography"
  },
  hoverFill: {
    name: "Hovering Fill Color",
    type: [plotdb.Color],
    desc: "Fill color when hovering element",
    'default': '#aaa',
    category: "Color"
  },
  hoverStroke: {
    name: "Hovering Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color when hovering element",
    'default': '#fff',
    category: "Color"
  },
  connectFill: {
    name: "Fill Color",
    type: [plotdb.Color],
    desc: "Fill color between connection path of data node",
    'default': '#aaa',
    category: "Line"
  },
  connectStroke: {
    name: "Stroke Color",
    type: [plotdb.Color],
    desc: "Stroke color between connection path of data node",
    'default': '#aaa',
    category: "Line"
  },
  connectStrokeWidth: {
    name: "Stroke width",
    type: [plotdb.Number],
    desc: "Stroke size between connection path of data node",
    'default': 2,
    category: "Line"
  },
  connectDashArray: {
    name: "Dash Array",
    type: [plotdb.String],
    desc: "SVG style dash array. '2 4' means 2px line and 4px space.",
    'default': "2 2",
    category: "Line"
  },
  gridShow: {
    name: "Show Grid",
    type: [plotdb.Boolean],
    'default': true,
    category: "Grid"
  },
  gridBackground: {
    name: "Background",
    type: [plotdb.Color],
    'default': '#fff',
    category: "Grid"
  },
  gridStroke: {
    name: "Color",
    type: [plotdb.Color],
    'default': '#ccc',
    category: "Grid"
  },
  gridStrokeWidth: {
    name: "Stroke Width",
    type: [plotdb.Number],
    'default': 1,
    category: "Grid"
  },
  gridFrameStroke: {
    name: "Frame Color",
    type: [plotdb.Color],
    'default': '#ccc',
    category: 'Grid'
  },
  gridFrameStrokeWidth: {
    name: "Frame Width",
    type: [plotdb.Number],
    'default': 3,
    category: 'Grid'
  },
  gridDashArray: {
    name: "Dash Style",
    type: [plotdb.String],
    'default': "2 4",
    category: "Grid",
    desc: "SVG style dash array. '2 4' means 2px line and 4px space."
  },
  padding: {
    name: "Padding",
    type: [plotdb.Number],
    'default': 10,
    category: "Global Settings"
  },
  bubbleSizeMin: {
    name: "Min Size",
    type: [plotdb.Number],
    'default': 0,
    category: "Bubble"
  },
  bubbleSizeMax: {
    name: "Max Size",
    type: [plotdb.Number],
    'default': 20,
    category: "Bubble"
  },
  bubbleFill: {
    name: "Fill Color",
    type: [plotdb.Color],
    'default': '#ffaaaa',
    category: "Bubble"
  },
  bubbleStroke: {
    name: "Stroke Color",
    type: [plotdb.Color],
    'default': '#c01d1d',
    category: "Bubble"
  },
  bubbleStrokeWidth: {
    name: "Stroke Width",
    type: [plotdb.Number],
    'default': '1',
    category: "Bubble"
  },
  bubblePadding: {
    name: "Bubble Padding",
    type: [plotdb.Number],
    'default': 5,
    category: "Bubble"
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
  legendShow: {
    name: "Show Legend",
    type: [plotdb.Boolean],
    'default': true,
    category: "Legend"
  },
  legendLabel: {
    name: "Label",
    type: [plotdb.String],
    category: "Legend"
  },
  legendPosition: {
    name: "Position",
    type: [plotdb.Choice(['top', 'left', 'right', 'bottom'])],
    'default': "right",
    category: "Legend"
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
    category: "Label"
  },
  labelShadowSize: {
    name: "Label Shadow Size",
    type: [plotdb.Number],
    'default': 2,
    category: "Label"
  },
  labelShow: {
    name: "Show Data Label",
    type: [plotdb.Boolean],
    'default': false,
    category: "Label"
  },
  nodeShow: {
    name: "Show Data Dot",
    type: [plotdb.Boolean],
    'default': true,
    category: "Dot"
  },
  nodeSize: {
    name: "Dot Size",
    type: [plotdb.Number],
    'default': 6,
    category: "Dot"
  },
  nodeFill: {
    name: "Fill Color",
    type: [plotdb.Color],
    desc: "fill Dot with this color",
    'default': '#eee',
    category: "Dot"
  },
  nodeStroke: {
    name: "Stroke Color",
    type: [plotdb.Color],
    desc: "draw Dot outline with this color",
    'default': '#919191',
    category: "Dot"
  },
  nodeStrokeWidth: {
    name: "Stroke Width",
    type: [plotdb.Number],
    'default': '1',
    category: "Dot"
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
    desc: "data larger than this value will be treated as positive, vice versa.",
    'default': 0,
    category: "Value"
  },
  sort: {
    name: "Sort data",
    type: [plotdb.Choice(['Ascending', 'Descending', 'None'])],
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
  }
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
  */,
  lineSmoothing: {
    name: "Line Smoothing",
    'default': "linear",
    type: [plotdb.Choice(['linear', 'step', 'step-before', 'step-after', 'basis', 'bundle', 'cardinal', 'monotone'])],
    category: "Line"
  },
  strokeWidth: {
    name: "Stroke Width",
    type: [plotdb.Number],
    desc: "Default Stroke width",
    'default': '2',
    category: "Global Settings"
  },
  strokeDashArray: {
    name: "Stroke Dash Style",
    type: [plotdb.Number],
    'default': '2',
    desc: "SVG style dash array. '2 4' means 2px line and 4px space.",
    category: "Global Settings"
  }
};
['X', 'Y', 'Radial', 'Angular'].forEach(function(n){
  var p, c, b, v;
  p = n.charAt(0).toLowerCase() + "Axis";
  c = n + " Axis";
  b = [plotdb.Boolean];
  n = [plotdb.Number];
  v = [plotdb.Color];
  plotdb.config[p + "Show"] = {
    name: "Show Axis",
    type: b,
    'default': true,
    category: c
  };
  plotdb.config[p + "ShowDomain"] = {
    name: "Show Basline",
    type: b,
    'default': true,
    category: c
  };
  plotdb.config[p + "TickSizeInner"] = {
    name: "Inner Tick Size",
    type: n,
    'default': 4,
    category: c
  };
  plotdb.config[p + "TickSizeOuter"] = {
    name: "Outer Tick Size",
    type: n,
    'default': 0,
    category: c
  };
  plotdb.config[p + "TickPadding"] = {
    name: "Tick Padding",
    type: n,
    'default': 4,
    category: c
  };
  plotdb.config[p + "Stroke"] = {
    name: "Stroke Color",
    type: v,
    'default': "#000",
    category: c
  };
  plotdb.config[p + "Label"] = {
    name: "Label",
    type: [plotdb.String],
    'default': "",
    category: c
  };
  plotdb.config[p + "TickCount"] = {
    name: "Tick Count",
    type: n,
    'default': 6,
    category: c,
    desc: "Hint on number of tick. Actual number will be decided by program"
  };
  plotdb.config[p + "LabelPosition"] = {
    name: "Label Position",
    type: [plotdb.Choice(['in', 'center'])],
    'default': "center",
    category: c
  };
  plotdb.config[p + "TickDirection"] = {
    name: "Tick Direction",
    type: [plotdb.Choice(['vertical', 'horizontal'])],
    'default': "horizontal",
    category: c
  };
  return plotdb.config[p + "HandleOverlap"] = {
    name: "Overlap Ticks",
    type: [plotdb.Choice(['none', 'hidden', 'offset'])],
    'default': "hidden",
    category: c,
    desc: "How should overlapped ticks be taken care?"
  };
});