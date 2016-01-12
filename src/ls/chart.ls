angular.module \plotDB
  ..controller \chartEditor, <[$scope]> ++ ($scope) ->
    $scope.chart = do
      init: ->
        $scope.chart.code.content = """
module.exports = plotdb.chart.create({
  name: "New Chart",
  title: "New Chart",
  desc: "No Description",
  author: "Your Name",
  mapping: {
    value: { type: [plotdb.Number], require: true },
    name: { type: [], require: false }
  },
  config: {
    padding: { type: [plotdb.Number], default: 10 },
    margin: { type: [plotdb.Number], default: 10 }
  },
  bind: function(root, data, config) {
  },
  resize: function(root, data, config) {
  },
  render: function(root, data, config) {
    root.style.background = 'red';
    root.style.height = '100px';
  }
});
"""
      setdim: (data, event,dim) ->
        console.log data, event
        dim.fields = [data]
      render: ->
        payload = {} <<< $scope.chart{doc,style,code}
        visualizer = document.getElementById(\visualizer)
        visualizer.contentWindow.postMessage payload, \http://localhost/
      doc: do
        option: do
          mode: \xml
          lineWrapping: true
          lineNumbers: true
        content: ""
      style: 
        option: do
          mode: \css
          lineWrapping: true
          lineNumbers: true
        content: ""
      code: 
        option: do
          mode: \javascript
          lineWrapping: true
          lineNumbers: true
        content: "function() {}"
    $scope.chart.init!
    setTimeout (->$scope.chart.render!), 1000
    $scope.$watch 'chart.code.content', (code) ->
      lines = code.split(\\n)
      start = 0
      maps = []
      for line in lines =>
        if /^\s*}\s*,\s*$/.exec(line) => break
        if start == 1 => maps.push line
        if /^\s*mapping\s*:\s*{\s*$/.exec(line) => start = 1
      $scope.chart.dimensions = []
      for map in maps =>
        ret = /(\S+)\s*:\s*{/.exec(map)
        if !ret => continue
        name = ret.1
        ret = /type\s*:\s*\[([^\]]*)\]/.exec(map)
        if !ret => continue
        type = ret.1.split(\,).map(->it.replace(/plotdb\./,"").trim!).filter(->it)
        ret = /require: (true|false)/.exec(map)
        if !ret => continue
        require = ret.1
        $scope.chart.dimensions.push {name, type, require}
    $scope.data = [
      { 
        name: \Population2015.csv, size: \456KB, rows: \72, color: \#f99, key: 1
        fields: [
          * name: \population, type: \Number, file: 1
          * name: \date, type: \Date, file: 1
        ]
      },
      { 
        name: \Agriculture.csv, size: \73KB, rows: \15, color: \#9f9, key: 2
        fields: [
          * name: \ratio, type: \Percent, file: 2
          * name: \area, type: \Number, file: 2
          * name: \revenue, type: \Number, file: 2
        ]
      },
    ]

