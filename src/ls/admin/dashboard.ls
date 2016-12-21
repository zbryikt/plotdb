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
      data = JSON.parse(JSON.stringify(signup.filter -> it.date))
      data.map (d,i) -> d.date = moment(d.date).format("YY/MM")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields
      chart.attach document.getElementById \adm-user-registration-month

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(signup.filter -> it.date))
      data = data.filter (d,i) -> (new Date!getTime!) - (new Date(d.date).getTime!) < 86400000 * 7
      data.map (d,i) -> d.date = moment(d.date).format("YY/MM/DD")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields
      chart.attach document.getElementById \adm-user-registration-7days

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(newchart.filter -> it.date))
      data.map (d,i) -> d.date = moment d.date .format("YY/MM/DD")
      fields2 = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(newchart.filter -> it.date))
      data.map (d,i) -> d.date = moment(d.date).format("YYYY/MM")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields2 = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation-month

    plotdb.load 953, (chart) ->
      data = JSON.parse(JSON.stringify(newchart.filter -> it.date))
      data = data.filter((d,i)-> ((new Date!getTime!) - (new Date(d.date).getTime!)) < 86400000 * 7)
      data.map (d,i) -> d.date = moment(d.date).format("YYYY/MM/DD")
      data = d3.nest!key(->it.date).entries(data)
      data.map -> it <<< {date: it.key, count: it.values.reduce(((a,b) -> a + +b.count),0)}
      fields2 = data-to-fields data, <[count date]>, <[value order]>
      chart.config {margin: 20, nodeSize: 4, nodeStrokeWidth: 0, legendShow: false}
      chart.data fields2
      chart.attach document.getElementById \adm-chart-creation-7days

    plotdb.load 1073, (chart) ->
      ur = userrank.map ->
        it.count = +it.count
        it
      fields = data-to-fields ur, <[count owner]>, <[value order]>
      chart.config {margin: 20, sort: "Descending"}
      chart.data fields
      chart.attach document.getElementById \adm-userrank

    plotdb.load 1073, (chart) ->
      ur = userrank.map ->
        it.count = +it.count
        it
      ur = ur.filter -> it.count >= 5
      fields = data-to-fields ur, <[count owner]>, <[value order]>
      chart.config {margin: 20, sort: "Descending"}
      chart.data fields
      chart.attach document.getElementById \adm-heavyuser

    plotdb.load 1069, (chart) ->
      data = JSON.parse(JSON.stringify(parents))
      data.map -> it.count = +it.count
      data.sort (a,b) -> b.count - a.count
      data = data.filter((d,i) -> i < 10)
      fields = data-to-fields data, <[count name]>, <[value name]>
      chart.config {margin: 20, sort: "Descending", xAxisShow: false}
      chart.data fields
      console.log data
      chart.attach document.getElementById \adm-hotchart

    plotdb.load 1073, (chart) ->
      data = JSON.parse(JSON.stringify(parents))
      data.map -> it.count = +it.count
      fields = data-to-fields data, <[count name]>, <[value order]>
      chart.config {margin: 20, sort: "Descending", xAxisTickDirection: "vertical"}
      chart.data fields
      chart.attach document.getElementById \adm-chart-parents

    sel = d3.select \#adm-recentchart .selectAll \tr.data .data recentchart
    sel.exit!remove!
    sel.enter!append \tr .attr class: \data
    d3.select \#adm-recentchart .selectAll \tr.data .html((d,i) ->
      [
        "<td><a href='https://plotdb.io/v/chart/#{d.key}' target='_blank'>#{d.name}</a></td>"
        "<td><a href='/user/#{d.owner}' target='_blank'>#{d.owner}</a></td>"
        "<td><a href='/chart/#{d.parent}' target='_blank'>#{d.parent}</a></td>"
        "<td>#{d.createdtime}</td>"
      ].join("")
    )
