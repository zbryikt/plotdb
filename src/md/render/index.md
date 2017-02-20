# PlotDB Renderer API

### overview

**Visworks** including charts, visualizations or interactive contents on PlotDB are all designed to be executed independently. You can download their corresponding PlotDB.json and render it in any website with PlotDB API. PlotDB API also enpowers you to update their configuration, data, and even reuse them in multiple container simultaneously.

Additionally, visworks can be bundled into one single javascript library using Collection. to see how this works, go directly to the [Collection section](/doc/render/#collection) for more information.

### Installation

Include [plotdb.js](https://plotdb.com/js/pack/view.js) and [pdb.css](https://plotdb.com/css/render/pdb.css) in your website:

    <link rel="stylesheet" type="text/css" href="pdb.css"/>
    <script type="text/javascript" src="plotdb.js"></script>


### A Sample Usage

The most simple way to render a PlotDB chart is using visworks ID:

    plotdb.load(2008, function(chart) {
      /* 'chart': your viswork object */
    });

Here we use ID `2008` - which points to `https://plotdb.com/chart/2008` - to get corresponding javascript object.

The returned object provides several useful methods for you to interact with it, for example, `attach`, which binds and renders your chart immediately into a container:

    plotdb.load(2008, function(chart) {
      chart.attach("#my-container");
    });

By default it renders with a sample data, like following:

<div id="container1" class="chart-demo"><div>
<script type="text/javascript">
  plotdb.load(2008, function(chart) {
    chart.attach("#container1");
  });
</script>


### Offline Rendering

Loading viswork with ID is quite convenient, yet it requests PlotDB server for the viswork, so you have to connect to internet, and your code will depend on PlotDB server. To render

Customize Data

Once you download your PlotDB.json, first include [plotdb.js](https://plotdb.com/js/pack/view.js) in your web page, then use plotdb.js to load your PlotDB.json with following code snippet:

    plotdb.load("http://path-to-your-plotdb-json", function(chart) {
        ....
    });

If you don't have a server to host your own PlotDB.json, you can also use your chart id directly which loads chart from https://plotdb.com/chart/[chart-id]:

    plotdb.load(2008, function(chart) {
            ....
        });


### Sample Usage

loads a chart and render it into two containers:

    plotdb.load('...', function(chart) {
      var chart2 = chart.clone();
      chart.attach(document.getElemenetById("container1"));
      chart2.attach(document.getElemenetById("container2"));
    });


update chart after resizing a container:

    plotdb.load('...', function(chart) {
      var node = document.getElementById("container");
      chart.attach(node);
      node.style.width = "500px";
      chart.resize();
      chart.render();
    });
        
setup the configuration programmatically:

    plotdb.load("...", function(chart) {
          chart.config({
            "font-size": 12,
            "font-family": "Arial",
            palette: {
              colors: [
                {hex: "#00ff00"},
                {hex: "#ff0000"}
              ]
            }
          })
        });

the returned chart object has following methods:

### clone()

Make a copy of this chart. If you need multiple instance of this chart to render different data, you can use `clone()` to make multiple copies of the chart object, and render them to different containers respectively.


### data(objArray, refresh, mapping)

Bind data with this chart. `data()` accepts an object array as the 1st parameter `objArray`, such as:

    [{name: "Apple", price: 10}, {name: "Pen", price: 5}, ...]

this parameter will be bound to the visual encodings of this chart by the schema we defined in the 3rd parameter `mapping`. `mapping` indicates which fields in the `objArray` should be mapped to which encoding, for example, following mapping maps field `name` to encoding `color`, and field `price` to encoding `size`:

    {
      color: ["name"],
      size: ["price"]
    }

Some chart accepts multiple fields in one encoding, such as line chart or stacked bar chat; specify multiple fields in corresponding array to bind multiple fields to a encoding, for example:

    {
      name: ["name"],
      value: ["price-2016", "price-2015"] 
    }

After data binding we need to redraw the chart. You can invoke related functions by yourself or set the 2nd parameter `refresh` to true to let PlotDB to do it for you.

Every chart uses different visual encoding, check the `dimension` section in the code for the name of each encodings and the data type they expect. For example, following is a typical dimension section:

    ...
    dimension: {
      value: { type: [plotdb.Number], multiple: true, require: true, desc: "y axis value" },
      order: { type: [plotdb.Order], require: false, desc: "x axis index" },
    },
    ...
    

With above code we have 2 dimensions: `value` and `order`. `value` accepts multiple fields with number data type and is required, `order` accepts single field with ordinal data type, and is optional.


### config(configObject)

Update configurations of this chart. `configObject` is a Javascript object containing configurations to update; for example, to set font family of this chart:

    chart.config(
      {
        fontFamily: "Tahoma"
      }
    );

Configurations can be number, string of even object, depending on the design of this chart. Following example updates this chart with a new palette object and disable popup:

    chart.config(
      {
        palette: {colors: [{hex: "#ff0000", "#00ff00"}],
        popupShow: false
      }
    )

Every chart has different configurations, check the `config` section in the code for a list of the configuration available for your chart.

Be sure to invoke `resize()` and `render()` after updating configurations. If you change a configuration with `rebindOnChange` being true, you should also invoke `bind()` before calling `resize()`:

    chart.config({...});
    chart.bind();
    chart.resize();
    chart.render();


### attach(htmlNode)

connect this chart with specific htmlNode. This will also render the chart into it. htmlNode should be a DOM element, so if you use jQuery to retrieve a node, pull its native DOM element out of the jQuery object at first:

    chart.attach($("#some-node")[0]);

PlotDB listens to window resize event to update chart, so if you adjust the dimension of the htmlNode programmatically, be sure to invoke `resize()` and `render()` to reflect the change to your chart.


### init()

Initialize this chart. `attach()` will call `init()` so usually we dont have to call it manually.


### parse()

Parse data before use in this chart. `attach()` will call `parse()` so usually we dont have to call it manually.


### bind()

Bind data to DOM element. `attach()` will call `bind()` so usually we dont have to call it manually.


### resize()

Update according to change in dimensions of container. PlotDB listens to window resize event and invoke `resize()` automatically, so if you manually change the dimension of container, you should also call `resize()` afterward.


### render()

Render this chart. This should be called every time a chart needs update, for eaxmple, after `resize()` being called.



### JSONP Style Chart Loading

Ajax and callback can sometimes be cumbersome, instead we could use JSONP style chart loading. To do so, first add the whole PlotDB.json with `plotdb.chart.add` and a proper name:

    plotdb.chart.add("my-chart", {... the PlotDB.json ...});
        
you can save the above code as a standalone js file, and load it with script tag after plotdb.js is loaded. to get an instance of the chart, use `plotdb.chart.get`:

    var chart = plotdb.chart.get("my-chart");

it returns the chart object like the one `plotdb.load` passes into the callback function.


