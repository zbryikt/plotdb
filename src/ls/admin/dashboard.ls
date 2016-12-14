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
      signup2 = signup.filter -> it.date
      signup2.map (d,i) -> d.date = moment d.date .format("YY/MM/DD")
      fields = data-to-fields signup2, <[count date]>, <[value order]>
      chart.config {margin: 30, nodeSize: 4, nodeStrokeWidth: 0}
      chart.data fields
      chart.attach document.getElementById \adm-user-registration

    plotdb.load 953, (chart) ->
      newchart2 = newchart.filter -> it.date
      newchart2.map (d,i) -> d.date = moment d.date .format("YY/MM/DD")
      fields2 = data-to-fields newchart2, <[count date]>, <[value order]>
      chart.config {margin: 30, nodeSize: 4, nodeStrokeWidth: 0}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation


    plotdb.load 1073, (chart) ->
      ur = userrank.map ->
        it.count = +it.count
        it
      fields = data-to-fields ur, <[count owner]>, <[value order]>
      console.log fields
      chart.config {margin: 30, sort: "Descending"}
      chart.data fields
      chart.attach document.getElementById \adm-userrank
