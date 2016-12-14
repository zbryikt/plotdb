angular.module \plotDB
  ..controller \adminDashboard, <[$scope]> ++ ($scope) ->
    data-to-fields = (data, field-names, dim-names) ->
      ret = {}
      field-names.map (n,i)-> 
        if data.0 and Array.isArray(data.0[n]) =>
          ret[dim-names[i]] = data.0[n].map (e,j) -> {name: n, data: data.map (d,i) -> d[n][j]}
        else ret[dim-names[i]] = [{name: n, data: data.map (d,i) -> d[n]}]
      ret

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(signup.filter -> it.date))
      data.map (d,i) -> d.date = moment d.date .format("YY/MM/DD")
      fields = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields
      chart.attach document.getElementById \adm-user-registration

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(newchart.filter -> it.date))
      data.map (d,i) -> d.date = moment d.date .format("YY/MM/DD")
      fields2 = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(signup.filter -> it.date))
      data.map (d,i) -> d.date = moment(d.date).format("YY/MM")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields
      chart.attach document.getElementById \adm-user-registration-month

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(newchart.filter -> it.date))
      data.map (d,i) -> d.date = moment(d.date).format("YYYY/MM")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields2 = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation-month


    plotdb.load 1073, (chart) ->
      ur = userrank.map ->
        it.count = +it.count
        it
      fields = data-to-fields ur, <[count owner]>, <[value order]>
      chart.config {margin: 20, sort: "Descending"}
      chart.data fields
      chart.attach document.getElementById \adm-userrank
