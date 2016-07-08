angular.module \plotDB
  ..controller \palEditor, <[$scope $http $timeout]> ++ ($scope, $http, $timeout) ->
    d3-scale = d3.scaleSqrt!
    d3-scale-r = d3.scaleLinear!

    $scope.preview = do
      type: \map
      init: -> $scope.$watch 'preview.type', -> $scope.render!
    $scope.preview.init!
    $scope.type = 1
    $scope.count = 6
    $scope.colors = []
    $scope.blindtest = 'normal'
    $scope.generate = (rand) ->
      if rand => $scope.colors = []
      if !($scope.count?) or $scope.count < 2 => $scope.count = 2
      if !$scope.colors => $scope.colors = []
      if $scope.colors.length < $scope.count =>
        $scope.colors ++= d3.range($scope.count - $scope.colors.length).map(->
          v = parseInt(Math.random! * 16777216).toString(16)
          v = "\##{\0 * (6 - v.length)}#v"
        ).map((d,i)-> {value: d, idx: i})
      else if $scope.colors.length > $scope.count =>
        $scope.colors.splice($scope.count, $scope.colors.length - $scope.count)
      if $scope.type == 2 =>
        [v1,v2] = [$scope.colors.0.value, $scope.colors[* - 1].value]
        hclint = d3.interpolateHcl v1, v2
        $scope.colors.map (d,i) ->
          v = d3.rgb(hclint(i / (($scope.colors.length - 1) or 1)))
          d.value = "#" + (<[r g b]>.map(->v[it].toString(16)).map(-> "0" * (2 - it.length) + it).join(""))
      else if $scope.type == 3 =>
        len = $scope.colors.length
        len2 = parseInt(len/2)
        [v1,v2] = [$scope.colors.0.value, $scope.colors[len2 - ((len + 1)%2)].value]
        [v3,v4] = [$scope.colors[len2 - ((len)%2)].value, $scope.colors[* - 1].value]
        hclint1 = d3.interpolateHcl v1, v2
        hclint2 = d3.interpolateHcl v3, v4
        len2 += (len%2)
        $scope.colors.map (d,i) ->
          if i < len2 => v = d3.rgb(hclint1(i / ((len2 - 1) or 1)))
          else 
            i -= (len2 - (len%2))
            v = d3.rgb(hclint2(i / ((len2 - 1) or 1)))
          d.value = "#" + (<[r g b]>.map(->v[it].toString(16)).map(-> "0" * (2 - it.length) + it).join(""))
      $scope.palette = "[#{$scope.colors.map((d) -> "\"#{d.value}\"").join(',')}]"
    $scope.generate!
    $scope.$watch 'count', $scope.generate

    circles = d3.range(150).map(-> { r: Math.random!*30 })
    d3.packSiblings circles
    outCircle = d3.packEnclose circles
    $scope.circle-group = d3.select \#pal-editor-preview .append \g
    $scope.circle-group.selectAll \circle .data circles .enter!append \circle .attrs do
      cx: -> it.x
      cy: -> it.y
      r: -> it.r
    $scope.circle-group.attrs do
      transform: ->
        r = outCircle.r
        rate = 190/r
        "translate(400 200) scale(#rate)"

    path = d3.geoPath!projection d3.geoAlbersUsa!scale(900).translate([400,200])
    $http do
      url: \/assets/misc/us.json
      method: \GET
    .success (d) -> 
      features = topojson.feature(d, d.objects.counties).features
      d3.csv \/assets/misc/us-pop-2013.csv, (data) ->
        hash = {}
        for item in data => hash[item.code] = item[2013]
        for item in features => 
          item.value = parseInt(hash[item.id] or 0)
        $scope.path-group = d3.select \#pal-editor-preview .append \g
        $scope.path-group.selectAll \path .data features .enter!append \path
          .attrs do
            d: path
            stroke: \#fff
            "stroke-width": 0.5
          .on \mousemove, (d,i) ->
        $scope.render!
    $scope.handler = do
      handle: null
      set: ->
        if @handle => $timeout.cancel @handle
        @handle = $timeout (-> $scope.generate!), 100
    $scope.config = do
      oncolorchange: -> 
        $scope.handler.set!
        $scope.render!
    $scope.picker = do
      node: null
      disabled: (idx) ->
        [len,type] = [$scope.colors.length, $scope.type]
        if type == 1 => return false
        if type == 2 and (idx > 0 and idx < len - 1) => return true
        if (type == 3 and
        (idx > 0 and idx < len - 1) and
        idx != parseInt(len/2) and idx != parseInt(len/2) - ((len + 1)%2)) => return true
        return false
      toggle: (e, c) ->
        if $scope.type==2 and c.idx>0 and c.idx < $scope.colors.length - 1 => return
        if c.idx==@idx => @isOn = !!!@isOn
        else @isOn = true
        @idx = c.idx
        @ptr = e.target.getBoundingClientRect!{left,top}
        @ptr.left -= 297
        @ptr.top += document.body.scrollTop
        setTimeout (~> @ldcp.setColor $scope.colors[@idx].value), 0
        e.preventDefault!
        e.cancelBubble = true
        e.stopPropagation!
      idx: 0
      isOn: false
      config: do
        oncolorchange: (c) -> $scope.$apply ->
          $scope.colors[$scope.picker.idx].value = c
          $scope.generate!
          $scope.render!
      init: ->
        @node = document.querySelector '#pal-editor-ldcp .ldColorPicker'
        @ldcp = new ldColorPicker null, @config, @node

    $scope.render = ->
      type = $scope.preview.type
      d3-scale
        .domain [0, 1000, 13000, 160000, 2000000]
        .range ($scope.colors or []).map(->it.value)
      if $scope.path-group =>
        that.attr \opacity, (if type != \bubble => \1 else \0)
        that.selectAll \path .attrs do
          fill: -> d3-scale it.value
      if $scope.circle-group =>
        d3-scale-r
          .domain d3.range($scope.colors.length).map(->30 * it / (($scope.colors.length - 1) or 1))
          .range ($scope.colors or []).map(->it.value)
        that.attr \opacity, (if type == \bubble => \1 else \0)
        that.selectAll \circle .attrs do
          fill: -> d3-scale-r it.r
    $scope.$watch 'type', ->
      $scope.generate!
      $scope.render!
    $scope.picker.init!
    document.body.addEventListener \click, (e) ->
      $scope.$apply -> $scope.picker.isOn = false

    (eventsrc) <- <[#pal-editor-output #pal-editor-output-copy]>.map
    clipboard = new Clipboard eventsrc
    clipboard.on \success, ->
      $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
      setTimeout((->$(eventsrc).tooltip('hide')), 1000)
    clipboard.on \error, ->
      $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
      setTimeout((->$(eventsrc).tooltip('hide')), 1000)

