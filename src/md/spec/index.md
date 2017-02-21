# PlotDB Viswork Specification

This document describes and guide you step by step to create a PlotDB-compatible **viswork** ( chart, visualization or interactive content ), which can be easily reused by others and even embedded into other websites.

*( In this document, we will both use the term **viswork** and **chart**, but they all refer to the same concept. )*

## First Step

Viswork has a set of predefined interface so it can communicate with PlotDB online editor and PlotDB renderer API. It is, however, just a simple JavaScript Object. for example, following example will print "hello world" in dev console:

    {
      render: function() {
        console.log("hello world");
      }
    }

as you can see, the `render` method is for rendering this viswork. Since we want to reuse this piece of code, this code will be executed under a viswork context ( `this` object ), and a DOM element stored in `this.root` is provided for it to render.

For eaxmple, to render 'hello world' in the DOM element:

    {
      render: function() {
        this.root.innerText = "hello world!";
      }
    }

### Initialization

Note that `render` will be called every time we need a redraw ( e.g., when container size changes ), so we will want to keep initialization or computing-intensive code out of `render`; for this purpose, we have `init` method:

    {
      init: function() {
        this.newNode = document.createElement("div");
        this.root.appendChild(node);
      },
      render: function() {
        this.newNode.innerText = "a new node";
      }
    }

### Resizing

`init` will only and should only be called once in the life time of viswork, unless you manually call it intentionally.

There are other methods which serves for different purposes. For example, `resize` will be called when container dimension is changed:

    {
      resize: function() {
        this.box = this.root.getBoundingClientRect();
      },
      render: function() {
        this.root.innerText = "Box Width = " + this.box.width;
      }
    }

Note that resize will be called if any configuration is updated.

### Data Parsing

`data` stores the input data as an array of object, and `parse` is called when input data is updated:

    {
      parse: function() {
        this.entries = this.data.length || 0;
      },
      render: function() {
        this.root.innerText = "there are " + this.entries + " items.";
      }
    }

### Data Binding

`bind` is called after `parse`, for binding between data and DOM element. This may be optional if you are not using libraries like d3js, which separate data binding from rendering:

    {
      bind: function() {
        var update = d3.select(this.root).selectAll("div").data(this.data);
        update.exit().remove();
        update.enter().append("div");  // these are d3js data binding logic, not a part of PlotDB.
      }
    }


### Finalize

If your viswork uses resources like `setInterval`, recursive calls of `requestAnimationFrame` or anything that should be destroyed after lifecycle of this viswork, you should do it in `destroy` method:

    {
      init: function() {
        this.timer = setInterval(function() {
          console.log("hello world");
        }, 1000); // Print "hello world" every 1 second
      },
      destroy: function() {
        clearInterval(this.timer); // clear timer otherwise it might go on forever!
      }
    }

### Wrap up

In short, lifecycle of a viswork will be like this:

 * **init()**   // Initialization. Create DOM elemenet, time, etc
 * **parse()**  // Data Parsing. calculate max value, date extent, or data transformation.
 * **bind()**   // Data Binding. optional if you dont have this kind of design logic.
 * **resize()** // Resize. will be called when container dimension or **viswork configuration** changes.
 * **render()** // render viswork. called each time viswork needs to be redrawn.

Processes of some typical scenario is summarized as follow:

**First time a viswork is rendered**

    init -> parse -> bind -> resize -> render

** Data update **

    parse -> bind -> resize -> render

** configuration update **

    resize -> render

*( some configuration requires binding to be called, which can be specified via `rebindOnChange` attribute )*

** Container resizing **

    resize -> render

Here is an example of bar chart which uses randomly generated data:

    {
      init: function() {
        for(var i=0;i<10;i++) {  // create 10 DIVs
          this.root.appendChild(document.createElement("div"));
        }
        this.nodes = this.root.querySelectorAll("div");
      },
      parse: function() {
        this.randomData = [];  // randomly generate 10 numbers
        for(var i=0;i<10;i++) this.randomData.push(Math.random());
      },
      bind: function() {  // bind data with DIVs
        for(var i=0;i<10;i++) this.nodes[i].data = this.randomData[i];
      },
      render: function() {
        for(var i=0;i<10;i++) { // styling DIVs correctly
          this.nodes[i].style.width = (this.nodes[i].data * 100) + "px";
          this.nodes[i].style.height = "17px";
          this.nodes[i].style.background = "#000";
        }
      }
    }

and the following is its output result:

<div id="container1" class="chart-demo"></div>
<script>
plotdb.chart.add("sample1", {code: {content: {
  init: function() {
    for(var i=0;i<10;i++) this.root.appendChild(document.createElement("div"));
    this.nodes = this.root.querySelectorAll("div");
  },
  parse: function() {
    this.randomData = [];
    for(var i=0;i<10;i++) this.randomData.push(Math.random());
  },
  bind: function() {
    var nodes = this.root.querySelectorAll("div");
    for(var i=0;i<10;i++) nodes[i].data = this.randomData[i];
  },
  render: function() {
    var nodes = this.root.querySelectorAll("div");
    for(var i=0;i<10;i++) {
      this.nodes[i].style.width = (this.nodes[i].data * 100) + "px";
      this.nodes[i].style.height = "17px";
      this.nodes[i].style.background = "#000";
    }
  }
}}});
var chart = plotdb.chart.get("sample1");
chart.attach("#container1");
</script>

you can copy above example code and paste into the **code panel** in the [PlotDB online editor](https://plotdb.com/chart/) to see how it works.

## Configuration

Once you create your first viswork, you may want to accept input data and let the viswork configurable for other people to use. In this section we covers the **configuration** part.

To add a configuration, add a new property in `config` member of your viswork:

    {
      config: {
        barColor: {}
      },
      ...
    }

in above example we add a "barColor" property in the `config` member. Property, however, needs to be defined properly, so we can how its data type and default value:

    barColor: {
      name: "Bar Color",                        // verbal name
      type: [plotdb.Color]                      // data type
      default: "red"                            // default value
      desc: "This is the color of the bar",     // additional information
      category: "Global Settings"               // category
    }

here we define barColor with name "Bar Color", a simple description, a default value `red`, a category and its data type. All these information will be used in the online editor for users to quickly configure your viswork to fit their need.

To use this config in code, look up `config` member for "barCode" property:

    {
      render: function() {
        this.root.style.background = this.config.barColor;
      }
    }

note again that config change will both trigger `resize` and `render` to be called in [PlotDB renderer](https://plotdb.com/doc/render/).

### Predefined Configurations and Inheritance

Sometimes it is tedious to write again and again all these configurations in different viswork. You can let a config to use settings from another config by using `extend` attribute:

    config: {
      barColor: {
        name: "Bar Color",
        type: [plotdb.Color],
        desc: "color of the bar",
        default: "red"
      },
      barStroke: {name: "Bar Stroke", extend: "barColor"}
    }

above example let `barStroke` extend `barColor`, which is another property defined in `config` object.

Furthermore, PlotDB provides predefined configuration for you to directly extend. For these configuration, you can just declare their existence, e.g.,

    config: {
      stroke: {}, // stroke is a predefined config
      fontSize: {}, // fontSize is also a predefined config
      barColor: { name: "Bar Color", ... } // barColor is not a predefined config
    }

and inheritance directly from predefined configuration is also possible:

    config: {
      myStroke: { extend: "stroke" } // extend a predefined configuration `stroke`
    }

### Re-bind on Change

Configuration changes trigger `resize` and `render` methods to be called, but if your config need rebind in data, you can set `rebindOnChange` to true:

    config: {
      bindMethod: { rebindOnChange: true }
    }

then it will trigger `bind -> resize -> render` when bindMethod is changed.

### Configuration Data Types

For now, PlotDB provides following data type:

 * [PlotDB.Number](#)
 * [PlotDB.Date](#)
 * [PlotDB.Choice](#)
 * [PlotDB.String](#)
 * [PlotDB.Color](#)
 * [PlotDB.Palette](#)

a complete list and usage can be found in the last section - [PlotDB Viswork API Reference](#).

Here is an example of bar chart what enable users to change bar color ( modified from above bar chart example ):

    {
      config: {
        barColor: {
          name: "Bar Color",
          type: [plotdb.Color],
          desc: "color of the bar",
          default: "red"
        },
        barStroke: {
          name: "Bar Stroke",
          default: "blue",
          extend: "barColor"
        }
      },
      init: function() {
        for(var i=0;i<10;i++) {  // create 10 DIVs
          this.root.appendChild(document.createElement("div"));
        }
        this.nodes = this.root.querySelectorAll("div");
      },
      parse: function() {
        this.randomData = [];  // randomly generate 10 numbers
        for(var i=0;i<10;i++) this.randomData.push(Math.random());
      },
      bind: function() {  // bind data with DIVs
        for(var i=0;i<10;i++) this.nodes[i].data = this.randomData[i];
      },
      render: function() {
        for(var i=0;i<10;i++) { // styling DIVs correctly
          this.nodes[i].style.width = (this.nodes[i].data * 100) + "px";
          this.nodes[i].style.height = "17px";
          this.nodes[i].style.background = this.config.barColor;
          this.nodes[i].style.border = "1px solid " + this.config.barStroke;
        }
      }
    }

and the following is its output result:

<div id="container2" class="chart-demo"></div>
<script>
plotdb.chart.add("sample2", {code: {content: {
  config: {
    barColor: {
      name: "Bar Color",
      type: [plotdb.Color],
      desc: "color of the bar",
      default: "red"
    },
    barStroke: {
      name: "Bar Stroke",
      default: "blue",
      extend: "barColor"
    }
  },
  init: function() {
    for(var i=0;i<10;i++) this.root.appendChild(document.createElement("div"));
    this.nodes = this.root.querySelectorAll("div");
  },
  parse: function() {
    this.randomData = [];
    for(var i=0;i<10;i++) this.randomData.push(Math.random());
  },
  bind: function() {
    for(var i=0;i<10;i++) this.nodes[i].data = this.randomData[i];
  },
  render: function() {
    for(var i=0;i<10;i++) {
      this.nodes[i].style.width = (this.nodes[i].data * 100) + "px";
      this.nodes[i].style.height = "17px";
      this.nodes[i].style.background = this.config.barColor;
      this.nodes[i].style.border = "1px solid " + this.config.barStroke;
    }
  }
}}});
var chart = plotdb.chart.get("sample2");
chart.attach("#container2");
</script>

<br/>

## Data and Dimension

As mentioned before,  we can use `data` member to access input data:

    {
      render: function() {
        this.root.innerText = this.data;
      }
    }

`data` member is simply a array of object; following is an example of `data` member:

    [
      { name: "Pineapple", value: 6 },
      { name: "Apple",     value: 4 },
    ]

However, we need to define the **field name** and **data type* of fields in each object so PlotDB can help mapping user data into this format. To define the data schema, use `dimension` member:

    {
      dimension: {
        label: {                 // name of field: 'label'
          type: [plotdb.Number], // type of field: Number
          require: true,         // require? yes
          desc: "Label of Bar",  // additional information
          multiple: false        // accept multiple value? no
        }
      },
      ...
    }

above example adds a new viswork *dimension* named **label**, with data type `plotdb.Number` and marked as required. it will then appear in the *Data Binding* section for user to drop their data field. This dimensin is also used in PlotDB Renderer API when calling `chart.data` API, check [PlotDB Renderer API Documentation](https://plotdb.com/doc/render/) for more detail.

### Multiple Value

If we define a dimension to be multiple, it will become an array in `data` member; following example prints all values with in input data into dev console:

    {
      dimension: {
        length: { type: [plotdb.Number], multiple: true }
      },
      render: {
        for(var i=0;i<this.data.length;i++) {
          for(var j=0;j<this.data[i].values.length;j++) {
            console.log(this.data[i].values[j]);
          }
        }
      }


### Additional Information about Dimension

`dimension` member provides us additional information about input data, such as data field name and field count:

    {
      render: function() {
        console.log("Field Names: ", this.dimension.values.fieldName);
        console.log("2nd Data Field: ", this.dimension.values.fields[1]);
      }
    }

Sometimes these information are quite useful when making legend or labels.

## Data Types

PlotDB defines several common data types which can be used in defing viswork dimension and configuration. They are:

* plotdb.Palette
* plotdb.Choice
* plotdb.Order
* plotdb.Date
* plotdb.Number
* plotdb.String
* plotdb.Numstring
* plotdb.Color

some of theme have different interface and usage, which are described below.

### plotdb.Choice

`plotdb.Choice` is dedicated for defining select options in a configuration. Following example demonstrates the usage of `plotdb.Choice`:

    {
      someConfig: {
        name: "Some Config",
        type: [plotdb.Choice(["Yes", "No"])],
        default: "Yes"
      }
    }

this example will show an selection box in config with two options "Yes" and "No" for users to choose. the selected data in `this.config` will be either "Yes" and "No" with `string` type in JavaScript.


### plotdb.Palette

Palette is dedicated for define palette in a configuration. It lets users design and use colors in a set. Following example demonstrates how to use 'plotdb.Palette':

    {
      someConfig: {
        name: "Some Config",
        type: [plotdb.Palette],
        default: {
          colors: [
            {hex: "#ff0000", keyword: "Apple"}, {hex: "#00ff00", keyword: "Lemon}
          ]
        }
      }
    }

the `hex` and `keyword` defines the color and the corresponding value to map to this color. in `config` object, this can be accessed as following:

    config.palette.colors[n].hex


### plotdb.Order

`plotdb.Order` is the base type of all ordinal data type. It provides a handy function for you to sort `data` in desired direction:

    plotdb.Order.sort(this.data, "someField", isAscending);


### plotdb.Date


`plotdb.Date` by default parses input date into an object in following format:

    {
      raw: <raw-data-from-input-data>,
      parsed: <parsed-result>,
      type: "Date"
    }


## Predefined Configurations

Follow and directly inherit from these configurations can make your viswork more compatible with other visworks, yet it is not a requirement.

### Global Settings
    language:
      name: "Language"
      type: [plotdb.Choice([{name: "正體中文", value: "zh-tw"}, {name: "English", value: "en"}])]
      default: {name: "English", value: "en"}
      rebindOnChange: true
      category: "Global Settings"

    fontFamily:
      name: "Font"
      type: [plotdb.String]
      default: "Arial"
      category: "Global Settings"

    fontSize:
      name: "Font Size"
      type: [plotdb.Number]
      default: 13
      category: "Global Settings"

    background:
      name: "Background"
      type: [plotdb.Color]
      default: '#ffffff'
      category: "Global Settings"

    textFill:
      name: "Text Color"
      type: [plotdb.Color]
      default: '#000000'
      category: "Global Settings"

    textFillInverse:
      name: "Text Color (Inverse)"
      type: [plotdb.Color]
      default: '#ffffff'
      category: "Global Settings"

    margin:
      name: "Margin"
      type: [plotdb.Number]
      default: 10
      category: "Global Settings"

    padding:
      name: "Padding"
      type: [plotdb.Number]
      default: 10
      category: "Global Settings"

    boxRoundness:
      name: "Block Roundness"
      type: [plotdb.Number]
      default: 0
      category: "Global Settings"

    palette:
      name: "Palette"
      type: [plotdb.Palette]
      subtype: plotdb.Palette.subtype.Qualitative
      default: {colors:[{hex:'#f4502a'},{hex:'#f1c227'},{hex:'#008a6d'},{hex:'#00acdb'},{hex:'#0064a8'}]}
      category: "Global Settings"

    colorNegative:
      name: "Negative"
      type: [plotdb.Color]
      desc: "Color for negative values"
      default: plotdb.Color.Negative
      subtype: plotdb.Color.subtype.Negative
      category: "Global Settings"

    colorPositive:
      name: "Positive"
      type: [plotdb.Color]
      desc: "Color for positive values"
      default: plotdb.Color.Positive
      subtype: plotdb.Color.subtype.Positive
      category: "Global Settings"

    colorNeutral:
      name: "Neutral"
      type: [plotdb.Color]
      desc: "Color for neutral values"
      default: plotdb.Color.Neutral
      subtype: plotdb.Color.subtype.Neutral
      category: "Global Settings"

    colorEmpty:
      name: "Empty"
      type: [plotdb.Color]
      desc: "Color for 'no values'"
      default: plotdb.Color.Empty
      subtype: plotdb.Color.subtype.Empty
      category: "Global Settings"

    colorPast:
      name: "Past"
      type: [plotdb.Color]
      desc: "Color for values in past"
      subtype: plotdb.Color.subtype.Fade
      category: "Global Settings"

    fill:
      name: "Fill"
      type: [plotdb.Color]
      default: "#e03f0e"
      category: "Global Settings"

    fillOpacity:
      name: "Fill Opacity"
      type: [plotdb.Number]
      default: 0.6
      category: "Global Settings"

    stroke:
      name: "Stroke"
      type: [plotdb.Color]
      desc: "Stroke Color"
      default: "#999"
      category: "Global Settings"

    strokeWidth:
      name: "Stroke Width"
      type: [plotdb.Number]
      desc: "Default Stroke width"
      default: 2
      category: "Global Settings"

    strokeDashArray:
      name: "Stroke Dash Style"
      type: [plotdb.Number]
      default: 2
      desc: "SVG style dash array. '2 4' means 2px line and 4px space."
      category: "Global Settings"

### Animation

    animationDuration:
      name: "Animation Duration"
      type: [plotdb.Number]
      default: 500
      desc: "Animation Duration, in millisecond (e.g., 500)"
      category: "Animation"

### Layout

    aspectRatio:
      name: "Aspect Ratio"
      type: [plotdb.Boolean]
      default: true
      category: "Layout"

### Popup

    popupShow:
      name: "show Popup"
      desc: "show Popup when user hovers over elements"
      type: [plotdb.Boolean]
      default: true
      category: "Popup"
      rebindOnChange: true

### Geography

    geoFill:
      name: "Fill Color"
      type: [plotdb.Color]
      desc: "Default color for filling geographic path"
      default: "#eee"
      category: "Geography"

    geoStroke:
      name: "Stroke Color"
      type: [plotdb.Color]
      desc: "Default color for outline of geographic path"
      default: "#919191"
      category: "Geography"

    geoStrokeWidth:
      name: "Stroke Width"
      type: [plotdb.Number]
      desc: "geographic path outline width"
      default: 1
      category: "Geography"

### Color

    hoverFill:
      name: "Hovering Fill Color"
      type: [plotdb.Color]
      desc: "Fill color when hovering element"
      default: "#aaa"
      category: "Color"

    hoverStroke:
      name: "Hovering Stroke Color"
      type: [plotdb.Color]
      desc: "Stroke color when hovering element"
      default: "#fff"
      category: "Color"

### Line

    connectFill:
      name: "Fill Color"
      type: [plotdb.Color]
      desc: "Fill color between connection path of data node"
      default: "#aaa"
      category: "Line"

    connectStroke:
      name: "Stroke Color"
      type: [plotdb.Color]
      desc: "Stroke color between connection path of data node"
      default: "#aaa"
      category: "Line"

    connectStrokeWidth:
      name: "Stroke width"
      type: [plotdb.Number]
      desc: "Stroke size between connection path of data node"
      default: 2
      category: "Line"

    connectDashArray:
      name: "Dash Array"
      type: [plotdb.String]
      desc: "SVG style dash array. '2 4' means 2px line and 4px space."
      default: "2 2"
      category: "Line"

    lineSmoothing:
      name: "Line Smoothing"
      default: "linear"
      type: [plotdb.Choice(<[
        linear step step-before step-after basis bundle cardinal monotone
      ]>)]
      category: "Line"

    lineStroke:
      name: "Line Color"
      type: [plotdb.Color]
      default: '#999'
      category: "Line"

    lineStrokeWidth:
      name: "Line Width"
      type: [plotdb.Number]
      default: 1
      category: "Line"

    lineDashArray:
      name: "Line Dash Array"
      type: [plotdb.String]
      default: "4 4"
      category: "Line"

### Grid

    gridShow:
      name: "Show Grid"
      type: [plotdb.Boolean]
      default: true
      category: "Grid"

    gridBackground:
      name: "Background"
      type: [plotdb.Color]
      default: "rgba(255,255,255,0)"
      category: "Grid"

    gridStroke:
      name: "Color"
      type: [plotdb.Color]
      default: "#ccc"
      category: "Grid"

    gridStrokeWidth:
      name: "Stroke Width"
      type: [plotdb.Number]
      default: 1
      category: "Grid"

    gridFrameStroke:
      name: "Frame Color"
      type: [plotdb.Color]
      default: "#ccc"
      category: "Grid"

    gridFrameStrokeWidth:
      name: "Frame Width"
      type: [plotdb.Number]
      default: 3
      category: "Grid"

    gridDashArray:
      name: "Dash Style"
      type: [plotdb.String]
      default: "2 4"
      category: "Grid"
      desc: "SVG style dash array. '2 4' means 2px line and 4px space."

### Bubble

    bubbleSizeMin:
      name: "Min Size"
      type: [plotdb.Number]
      default: 0
      category: "Bubble"

    bubbleSizeMax:
      name: "Max Size"
      type: [plotdb.Number]
      default: 20
      category: "Bubble"

    bubbleFill:
      name: "Fill Color"
      type: [plotdb.Color]
      default: "#ffaaaa"
      category: "Bubble"

    bubbleFillOpacity:
      name: "Fill Opacity"
      type: [plotdb.Number]
      default: 0.5
      category: "Bubble"

    bubbleStroke:
      name: "Stroke Color"
      type: [plotdb.Color]
      default: "#c01d1d"
      category: "Bubble"

    bubbleStrokeWidth:
      name: "Stroke Width"
      type: [plotdb.Number]
      default: 1
      category: "Bubble"

    bubblePadding:
      name: "Bubble Padding"
      type: [plotdb.Number]
      default: 5
      category: "Bubble"

### TBD

    barThick:
      name: "Bar Thickness"
      type: [plotdb.Number]
      default: 10
      category: "Layout"

    lineThick:
      name: "Line Thickness"
      type: [plotdb.Number]
      default: 10
      category: "Layout"

### Legend

    legendShow:
      name: "Show Legend"
      type: [plotdb.Boolean]
      default: true
      category: "Legend"

    legendLabel:
      name: "Label"
      type: [plotdb.String]
      category: "Legend"

    legendPosition:
      name: "Position"
      type: [plotdb.Choice(<[top left right bottom]>)]
      default: "right"
      category: "Legend"

### Label

    otherLabel:
      name: "Label for 'other'"
      type: [plotdb.String]
      default: "Other"
      category: "Label"

    showLabel: do #legacy. backward compatibility
      name: "Show Data Label"
      type: [plotdb.Boolean]
      default: false
      category: "Label"

    labelShadowSize:
      name: "Label Shadow Size"
      type: [plotdb.Number]
      default: 2
      category: "Label"

    labelShow:
      name: "Show Data Label"
      type: [plotdb.Boolean]
      default: false
      category: "Label"

    labelShowValue:
      name: "Show Value"
      type: [plotdb.Boolean]
      desc: "Show value labels in chart"
      default: false
      rebindOnChange: true
      category: "Label"

    labelShowOverflow:
      name: "Show Overflow Label"
      type: [plotdb.Boolean]
      desc: "Show all label, even if they are too long."
      default: false
      category: "Label"

    labelPosition:
      name: "Label Position"
      type: [plotdb.Choice(["in","out"])]
      default: "out"
      category: "Label"

    showPercent:
      name: "Percentage in Label"
      type: [plotdb.Boolean]
      desc: "Show percentage in data label"
      default: true
      category: "Label"

### Dot

    nodeShow:
      name: "Show Data Dot"
      type: [plotdb.Boolean]
      default: true
      category: "Dot"

    nodeSize:
      name: "Dot Size"
      type: [plotdb.Number]
      default: 6
      category: "Dot"

    nodeFill:
      name: "Fill Color"
      type: [plotdb.Color]
      desc: "fill Dot with this color"
      default: "#eee"
      category: "Dot"

    nodeStroke:
      name: "Stroke Color"
      type: [plotdb.Color]
      desc: "draw Dot outline with this color"
      default: "#919191"
      category: "Dot"

    nodeStrokeWidth:
      name: "Stroke Width"
      type: [plotdb.Number]
      default: 1
      category: "Dot"

### Value

    unit:
      name: "Unit"
      type: [plotdb.String]
      default: ""
      desc: "Unit of value"
      category: "Value"

    xScaleRange:
      name: "Data Range in X axis"
      type: [plotdb.Range]
      desc: "Enforce chart rendering within this range, in x axis"
      default: [0,1]
      category: "Value"

    yScaleRange:
      name: "Data Range in Y axis"
      type: [plotdb.Range]
      desc: "Enforce chart rendering within this range, in y axis"
      default: [0,1]
      category: "Value"

    rScaleRange:
      name: "Data Range in Circle Radius"
      type: [plotdb.Range]
      desc: "Enforce chart rendering within this range, in circle radius"
      default: [0,1]
      category: "Value"

    threshold:
      name: "Threshold"
      type: [plotdb.Number]
      desc: "data larger than this value will be treated as positive, vice versa."
      default: 0
      category: "Value"

    sort:
      name: "Sort data"
      type: [plotdb.Choice(<[Ascending Descending None]>)]
      default: "Descending"
      category: "Value"

    emptyAs0:
      name: "Empty as 0"
      type: [plotdb.Boolean]
      desc: "Treat undefined data as 0"
      default: true
      category: "Value"

    otherLimit:
      name: "Small Data Threshold"
      type: [plotdb.Number]
      desc: "Data smaller than this value will be clustered into one set of data"
      default: 0
      category: "Value"

