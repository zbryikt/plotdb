angular.module \plotDB
  ..controller \palEditor,
  <[$scope $http $timeout paletteService eventBus plNotify]> ++
  ($scope, $http, $timeout, paletteService, eventBus, plNotify) ->
    $scope.scale = map: d3.scaleQuantile!, bubble: d3.scaleOrdinal!
    $scope.tooltip = plotd3.html.tooltip(
      document.getElementById(\pal-editor-preview-wrap)
    ).on \mousemove, (d,i,popup) ->
      popup.select(".value").text(d.value)
      popup.style "margin-left": \15px

    $scope.preview = do
      type: \map
      init: -> $scope.$watch 'preview.type', -> $scope.render!
    $scope.preview.init!
    $scope.type = 1
    $scope.loading = true
    $scope.count = 6
    $scope.blindtest = 'normal'
    $scope.palette = new paletteService.palette!
    $scope.rgb2hex = (v)->
      "#" + (<[r g b]>.map((k,i)->
        d = Math.round(v[k])
        d >?= 0
        d <?= 255
        d.toString(16)
      ).map(-> "0" * (2 - it.length) + it).join(""))
    $scope.palList = do
      isOn: false
      toggle: (e) ->
        @isOn = !!!@isOn
        e.stopPropagation!
        e.cancelBubble = true
    $scope.setPalette = (pal) ->
      $scope.palette = new paletteService.palette(pal)
      $scope.count = $scope.palette.colors.length
      $scope.generate!
      $scope.render!
    $scope.create = ->
      $scope.palette = new paletteService.palette!
      $scope.generate true
      $scope.render!
    $scope.delete = ->
      eventBus.fire \loading.dimmer.on
      $scope.palette.delete!
        .then ->
          $scope.$apply -> $timeout (->
            eventBus.fire \loading.dimmer.off
            eventBus.fire \paledit.delete, $scope.palette.key
            plNotify.send \success, "palette delete"
            $scope.palette = new paletteService.palette!
            $scope.generate!
            $scope.render!
          ), 500
        .catch ->
          $scope.$apply -> $timeout (->
            eventBus.fire \loading.dimmer.off
            plNotify.send \error, "failed to delete. try again later?"
          ), 500
    $scope.save = ->
      if !$scope.palette.name => return setTimeout((->$(\#pal-editor-name).tooltip \show),0)
      if $scope.palette._type.location != \server =>
        $scope.palette._type <<< location: \server, name: \palette
        delete $scope.palette.key
      eventBus.fire \loading.dimmer.on
      $scope.palette.save!
        .then ->
          $scope.$apply -> $timeout (->
            eventBus.fire \loading.dimmer.off
            eventBus.fire \paledit.update, $scope.palette
            plNotify.send \success, "palette saved"
          ), 500
        .catch ->
          $scope.$apply -> $timeout (->
            eventBus.fire \loading.dimmer.off
            plNotify.send \error, "save failed. try again later?"
          ), 500

    $scope.generate = (rand) ->
      pal = $scope.palette
      if !($scope.count?) => $scope.count = 6
      if $scope.count < 2 => $scope.count = 2
      if $scope.count > 10 => $scope.count = 10
      if rand or !pal.colors => pal.colors = []
      list = pal.colors.map(-> {} <<< it)
      if list.length < $scope.count =>
        list ++= d3.range($scope.count - list.length).map(->
          v = parseInt(Math.random! * 16777216).toString(16)
          v = "\##{\0 * (6 - v.length)}#v"
        ).map((d,i)-> {hex: d, idx: i})
      else if list.length > $scope.count =>
        list.splice($scope.count, list.length - $scope.count)
      if $scope.type == 1 and rand =>
        order = d3.shuffle(d3.range(list.length))
        for i from 0 til list.length
          h = parseInt((360 * i / list.length) + Math.random! * 6 - 3)
          c = Math.round(Math.random!*20 + 50)
          l = Math.round(20 + 60 * order[i] / list.length)
          list[i].hex = $scope.rgb2hex(d3.rgb(d3.hcl(h,c,l)))
      else if $scope.type == 2 =>
        [v1,v2] = [list.0.hex, list[* - 1].hex]
        hclint = d3.interpolateHcl v1, v2
        list.map (d,i) ->
          v = d3.rgb(hclint(i / ((list.length - 1) or 1)))
          d.hex = $scope.rgb2hex(v)
      else if $scope.type == 3 =>
        len = list.length
        len2 = parseInt(len/2)
        [v1,v2] = [list.0.hex, list[len2 - ((len + 1)%2)].hex]
        [v3,v4] = [list[len2 - ((len)%2)].hex, list[* - 1].hex]
        v2 = d3.hcl(v1)
        v3 = d3.hcl(v4)
        v2.l = (100 - v2.l) * 0.9 + v2.l
        v2.c = 10
        v3.l = (100 - v3.l) * 0.9 + v3.l
        v3.c = 10
        v2 = v2.toString!
        v3 = v3.toString!
        hclint1 = d3.interpolateHcl v1, v2
        hclint2 = d3.interpolateHcl v3, v4
        len2 += (len%2)
        list.map (d,i) ->
          if i < len2 => v = d3.rgb(hclint1(i / ((len2 - 1) or 1)))
          else
            i -= (len2 - (len%2))
            v = d3.rgb(hclint2(i / ((len2 - 1) or 1)))
          d.hex = "#" + (<[r g b]>.map(->v[it].toString(16)).map(-> "0" * (2 - it.length) + it).join(""))
      $scope.json-output = "[#{list.map((d) -> "\"#{d.hex}\"").join(',')}]"
      $scope.palette.colors = list
      $scope.palette.width = 100 / (list.length or 1)
    $scope.generate!
    $scope.$watch 'count', -> (
      $scope.generate!
      $scope.render!
    )
    circles = d3.range(150).map((d,i)->
      v = Math.random!* 30
      { r: v**0.5, value: v, category: d }
    )
    d3.packSiblings circles
    outCircle = d3.packEnclose circles
    $scope.circle-group = d3.select \#pal-editor-preview .append \g
    sel =  $scope.circle-group.selectAll \circle .data circles .enter!append \circle .attrs do
      cx: -> it.x
      cy: -> it.y
      r: -> it.r
    $scope.tooltip.nodes(sel)
    $scope.circle-group.attrs do
      transform: ->
        r = outCircle.r
        rate = 190/r
        "translate(400 250) scale(#rate)"

    path = d3.geoPath!projection d3.geoAlbersUsa!scale(900).translate([400,200])
    $http do
      url: \/assets/misc/us.json
      method: \GET
    .success (d) ->
      features = topojson.feature(d, d.objects.counties).features
      d3.csv \/assets/misc/us-unemployment-rate-2015.csv, (data) -> $scope.$apply ->
        $scope.loading = false
        hash = {}
        $scope.values = data.map(-> it.percent = parseFloat(it.percent))
        $scope.valueRange = d3.extent($scope.values)
        $scope.scale.map.domain $scope.values
        for item in data => hash[item.code] = item.percent
        for item in features =>
          id = (if item.id < 10000 => "0" else "") + item.id
          item.value = parseInt(hash[id] or 0)
        $scope.path-group = d3.select \#pal-editor-preview .append \g .attrs do
          transform: "translate(0 18)"
        sel = $scope.path-group.selectAll \path .data features .enter!append \path
          .attrs do
            d: path
            stroke: \#fff
            "stroke-width": 0.5
        $scope.tooltip.nodes(sel)
        $scope.render!
    .error (d) -> $scope.loading = false
    $scope.handler = do
      handle: null
      set: ->
        if @handle => $timeout.cancel @handle
        @handle = $timeout (-> $scope.generate!), 100
    $scope.picker = do
      node: null
      disabled: (idx) ->
        [len,type] = [$scope.palette.colors.length, $scope.type]
        if type == 1 => return false
        if (type == 2 or type == 3) and (idx > 0 and idx < len - 1) => return true
        return false
      toggle: (e, c) ->
        if $scope.type==2 and c.idx>0 and c.idx < $scope.palette.colors.length - 1 => return
        if c.idx==@idx => @isOn = !!!@isOn
        else @isOn = true
        @idx = c.idx
        @ptr = e.target.getBoundingClientRect!{left,top}
        @ptr.left -= 297
        @ptr.top += document.body.scrollTop
        setTimeout (~> @ldcp.setColor $scope.palette.colors[@idx].hex), 0
        e.preventDefault!
        e.cancelBubble = true
        e.stopPropagation!
      idx: 0
      isOn: false
      config: do
        oncolorchange: (c) -> $scope.$apply ->
          $scope.palette.colors[$scope.picker.idx].hex = c
          $scope.generate!
          $scope.render!
      init: ->
        @node = document.querySelector '#pal-editor-ldcp .ldColorPicker'
        @ldcp = new ldColorPicker null, @config, @node
    $scope.valueRange = [0,1]
    $scope.render = ->
      type = $scope.preview.type
      $scope.scale.map
        .range ($scope.palette.colors or []).map(->it.hex)
      if $scope.path-group =>
        that.attr \opacity, (if type != \bubble => \1 else \0)
        that.selectAll \path .attrs do
          fill: -> $scope.scale.map it.value
      if $scope.circle-group =>
        $scope.scale.bubble
          .domain d3.range($scope.palette.colors.length)
          .range ($scope.palette.colors or []).map(->it.hex)
        that.attr \opacity, (if type == \bubble => \1 else \0)
        that.selectAll \circle .attrs do
          fill: -> $scope.scale.bubble(it.category % $scope.palette.colors.length)
    $scope.$watch 'type', ->
      $scope.generate!
      $scope.render!
    $scope.picker.init!
    document.body.addEventListener \click, (e) ->
      $scope.$apply ->
        $scope.picker.isOn = false
        $scope.palList.isOn = false

    (eventsrc) <- <[#pal-editor-output #pal-editor-output-copy]>.map
    clipboard = new Clipboard eventsrc
    clipboard.on \success, ->
      $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
      setTimeout((->$(eventsrc).tooltip('hide')), 1000)
    clipboard.on \error, ->
      $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
      setTimeout((->$(eventsrc).tooltip('hide')), 1000)

