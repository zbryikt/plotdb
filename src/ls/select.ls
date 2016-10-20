angular.module \plotDB
  ..controller \plSelectController, <[$scope]> ++ ($scope) ->
    $scope.portal = {data: [], options: []}
    $scope.init = (data, type, scope) ->
      $scope.portal.data = data
      $scope.type = type
      $scope.scope = scope
    $scope.get-idx = (item)->
      idx = $scope.portal.data.indexOf(item)
      return if idx < 0 =>
        ret = $scope.portal.data.map((d,i)-> [d.key == item.key,i]).filter(->it.0).0
        if ret => ret.1 else -1
      else idx
    $scope.remove = (item,$event) ->
      idx = $scope.get-idx item
      if idx < 0 => return
      $scope.portal.data.splice idx, 1
    $scope.add = (item,$event) ->
      idx = $scope.get-idx item
      if idx < 0 => return
      $scope.portal.data.push item
    $scope.toggle = (item,$event) ->
      idx = $scope.get-idx item
      if idx < 0 => $scope.portal.data.push item
      else $scope.portal.data.splice idx, 1

  ..directive \plselect,
  <[$compile $timeout entityService $http]> ++
  ($compile, $timeout, entityService, $http) -> do
    require: <[]>
    restrict: \A
    scope: do
      portal: \=ngPortal
      type: \@ngType
      scope: \@ngScope
    link: (s,e,a,c) ->
      dropdown-close-on-click = true
      auto-hide-input = false # set to true to prevent strange ui when input = one line height
      config = entityService.config.plselect[s.type or 'entity']
      dropdown = e.find \.select-dropdown
      input = e.find \input
      input.attr \placeholder, config.placeholder or 'search...'
      paging = limit: 20, offset: 0
      handler = null
      idmap = {}
      sync = ->
        s.portal.options.map -> idmap[it.key] = it
        for k,v of idmap => v.selected = false
        s.portal.data.forEach ->
          if idmap[it.key] and it.type == idmap[it.key].type => idmap[it.key].selected = true
      s.$watch 'portal.data', (-> sync!), true
      s.$watch 'portal.options', (-> sync!), true
      fetch = (keyword,reset = false) ->
        if handler =>
          $timeout.cancel handler
        else s.portal.loading = ((s.portal.loading or 0) + 1) or 1
        handler := $timeout (->
          if reset =>
            paging <<< offset: 0
            s.portal.end = false
          $http do
            url: config.ajax.url
            method: \GET
            params: config.ajax.param keyword, paging.limit, paging.offset, s.scope
          .success (d) ->
            handler := null
            if !d or d.length ==0 => s.portal.end = true
            if paging.offset == 0 => s.portal.options = d
            else s.portal.options = (s.portal.options or []) ++ d
            s.portal.loading--
            if s.portal.loading < 0 => s.portal.loading = 0
            paging.offset += paging.limit
        ), 1000
      repos = ->
        if !e.0 => return
        last = e.find '.select-input div.select-option:last-of-type' .0
        scrolltop = e.find '.select-input' .0.scrollTop
        base = e.0.getBoundingClientRect!
        if last => last = last.getBoundingClientRect!
        else last = {left: base.left, width: 0, top: base.top + 6, height: base.height}
        x = last.left + last.width - base.left + 4
        y = last.top - base.top - 1 + scrolltop
        w = base.width - x - 10
        repos.newline = false
        if w < last.width =>
          repos.newline = true
          x = 6
          y = last.bottom + 3 - base.top + scrolltop
          w = base.width - 12
        input.css \left, x + "px"
        input.css \top, y + "px"
        input.css \width, (if (w > 10) => "#{w}px" else "100%")
        input.css \position, \absolute

      close = (delay) ->
        if close.closing => $timeout.cancel close.closing
        close.closing = $timeout (->
          close.closing = 0
          dropdown.hide!
          e.removeClass \open
          if auto-hide-input and repos.newline => input.hide!
        ), delay
      close.closing = 0
      close.cancel = ->
        if close.closing => $timeout.cancel(close.closing)
        close.closing = 0

      s.$watch 'portal.data', (-> $timeout (-> repos!), 10), true
      e.find \.select-input .on \click, ->
        repos!
        if it.target.tagName == \I and it.target.className == "fa fa-close" => return
        input.show!
        input.focus!
        if input.val! =>
          dropdown.show!
          e.addClass \open
          repos!

      dropdown.on \click, ->
        if dropdown-close-on-click => return
        close.cancel!
        input.show!
        input.focus!
        if input.val! =>
          dropdown.show!
          e.addClass \open
          repos!

      input.on \blur, -> close 100
      input.on \keydown, (ev) ->
        keycode = ev.keyCode
        if keycode == 27 => return input.blur!
        e.addClass \open
        dropdown.show!
        s.portal.options = []
        last-value = input.val!
        $timeout (-> # for correct input.val!
          paging := limit: 20, offset: 0
          s.portal.needchar = 3 - input.val!length
          if input.val!length >= 3 => fetch input.val!, true
          if ev.keyCode == 8 and !input.val! and !last-value => s.$apply ->
            s.portal.data.splice s.portal.data.length - 1, 1
            repos!
        ), 0
      dropdown.on \scroll, (ev) ->
        base = dropdown.0.getBoundingClientRect!
        last = dropdown.find '.select-option'
        if !last.length => return
        last = last[last.length - 1].getBoundingClientRect!
        y = last.top + last.height - base.top - base.height
        if y < 5 and !s.portal.loading and !s.portal.end => s.$apply -> fetch input.val!

  ..controller \selecttest, <[$scope]> ++ ($scope) ->
    $scope.blah = [
      {key: 2, displayname: "Kirby", avatar: "team-29"},
      {key: 3, displayname: "PlotDB", avatar: "team-32"},
      {key: 4, displayname: "twstat", avatar: "team-33"},
      {key: 5, displayname: "CWB", avatar: "team-29"}
    ]
    $scope.test = []
    $scope.gogo = -> $scope.blah = [{key: 123, displayname: '123', id: 123}]
