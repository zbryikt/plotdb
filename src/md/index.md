# Overview

PlotDB is a platform for developers to create reusable visualization for people who cannot code. To do this, a visualization is split into following parts:

 * data bindings / mapping between data fields and visual encoding
 * configurations / chart settings, colors, labels, etc
 * sources ( code, stylesheet and document )
 * assets

These parts are well-defined in a JSON-style structure; by proper defining dimensions and configurations of a visualization, these options can then be configured by people through PlotDB's online visualization editor.

Furthermore, a visualization can also be accessed via programmable interface; instead of using online editor, we can pass data, configurations or even firing event to the visualization others created through PlotDB's rendering API.


### Write Your Own Viswork

Visualizations in PlotDB are organized in a JSON-style structure, so you can simply create one from scratch if you want. Yet, [PlotDB Online Editor](https://plotdb.com/chart/) does the most redundant work for us, so we can focus on the most important part.

A viswork is composed of following parts:

 * source code (JavaScript)
 * stylesheet (CSS)
 * document (HTML)
 * assets (images, geojson, etc)

#### Source Code

A simple PlotDB JSON Source will be like this:

    {
      sample: function() { ... },
      dimension: { ... },
      config: { ... },
      init: function() { ... },
      parse: function() { ... },
      bind: function() { ... },
      resize: function() { ... },
      render: function() { ... }
    }

### Programmable Control

Visualization in PlotDB can be used by downloading images or through iframe embedding, but either way has its own limitation:

 * png / svg download - interactivity is lost
 * iframe embedding - must have internet access; visualization cannot interact with host document

Sometimes we need inline these visualizations, and this can be done by PlotDB Renderer API. The simplest way to use a PlotDB Renderer API will be like this:

    plotdb.load(953, function(chart) {
      chart.attach(document.body);
    });

This renders visualization with online id '953' ( i.e., https://plotdb.io/v/chart/953 ) into document.body, which is a line chart. This still requests charts from PlotDB, to use an offline version we have to download the PlotDB JSON of that chart first, and load the JSON file by its URL. For example, by download chart 953 to "http://localhost/953.json":

    plotdb.load("http://localhost/953.json", function(chart) {
      chart.attach(document.body);
    });

We can further control the loaded chart instance with a bunch of API PlotDB provided:

 * chart.data   - apply data upon this chart
 * chart.config - update configuration
 * chart.init, chart.parse, chart.resize, chart.bind, chart.render - these functions invoke their counter part inside PlotDB JSON.
 * chart.attach(node) - set root element of this chart and render immediately

### Theme Customization

PlotDB also provides a mechanism to make collection of configuration called "theme" to let these configurations also reusable.

- - -

## PlotDB Renderer Interface


Once you create your visualization with PlotDB editor, you can download its corresponding PlotDB.json and render it in any website programmatically. Via PlotDB API, you can update its configuration, data or even render into multiple containers simultaneously.

Once you download the PlotDB.json, first load it with following code snippet:

    plotdb.load("http://path-to-your-plotdb-json", function(chart) {
        ....
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


### JSONP Style Chart Loading

Ajax and callback can sometimes be cumbersome, instead we could use JSONP style chart loading. To do so, first add the whole PlotDB.json with `plotdb.chart.add` and a proper name:

    plotdb.chart.add("my-chart", {... the PlotDB.json ...});
        
you can save the above code as a standalone js file, and load it with script tag after plotdb.js is loaded. to get an instance of the chart, use `plotdb.chart.get`:

    var chart = plotdb.chart.get("my-chart");

it returns the chart object like the one `plotdb.load` passes into the callback function.

