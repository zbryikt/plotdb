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
