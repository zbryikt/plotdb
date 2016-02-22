plotdb.render = (id, node, cb) ->
  (chart) <- d3.json "/d/chart/#id", _
  node.innerHTML = [
    "<div id='container'>"
    chart.doc.content
    "<style type='text/css'>"
    '''
    html,body,#container {
      width: 100%;
      height: 100%;
      background: initial;
    }
    body.loading {
      background: url(/assets/img/loading-lg.gif) center center no-repeat;
    }
    #container {
      position: relative;
      z-index: 1;
    }
    '''
    "</style>"
    "<style type='text/css'>#{chart.style.content}</style>"
    "</div>"
  ].join("")
  <- setTimeout _, 0
  eval(chart.code.content)
  window.module = module
  plotdb.viewer.render chart
