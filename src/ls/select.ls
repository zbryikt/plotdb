angular.module \plotDB
  ..controller \plSelectController, <[$scope]> ++ ($scope) ->
    $scope.portal = {data: [], options: [], type: ""}
    $scope.init = (data, type) ->
      $scope.portal.data = data
      $scope.type = type
    $scope.remove = (item,$event) ->
      idx = $scope.portal.data.indexOf(item)
      if idx < 0 => return
      $scope.portal.data.splice idx, 1
      $event.stop-propagation!
      $event.prevent-default!
    $scope.add = (item,$event) ->
      if $scope.portal.data.indexOf(item)>=0 or
      $scope.portal.data.filter(->it.key == item.key).length => return
      $scope.portal.data.push item

  ..directive \plselect,
  <[$compile $timeout entityService $http]> ++
  ($compile, $timeout, entityService, $http) -> do
    require: <[]>
    restrict: \A
    scope: do
      portal: \=ngPortal
    link: (s,e,a,c) ->
      dropdown = e.find \.select-dropdown
      input = e.find \input
      paging = limit: 20, offset: 0
      fetch = (keyword) ->
        s.portal.loading = true
        $timeout (->
          $http do
            url: "/d/entity/?keyword=#keyword&limit=#{paging.limit}&offset=#{paging.offset}"
            method: \GET
          .success (d) ->
            if paging.offset == 0 => s.portal.options = d
            else s.portal.options = (s.portal.options or []) ++ d
            s.portal.loading = false
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
        input.css \width, w + "px"
        input.css \position, \absolute

      close = (delay) ->
        if close.closing => $timeout.cancel close.closing
        close.closing = $timeout (->
          close.closing = 0
          dropdown.hide!
          e.removeClass \open
          if repos.newline => input.hide!
        ), delay
      close.closing = 0
      close.cancel = ->
        if close.closing => $timeout.cancel(close.closing)
        close.closing = 0

      s.$watch 'portal.data', (-> $timeout (-> repos!), 10), true
      e.find \.select-input .on \click, ->
        if it.target.tagName == \I and it.target.className == "fa fa-close" => return
        input.show!
        input.focus!
        if input.val! =>
          dropdown.show!
          e.addClass \open
          repos!

      dropdown.on \click, ->
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
        dropdown.show!
        paging := limit: 20, offset: 0
        s.portal.options = []
        last-value = input.val!
        $timeout (-> # for correct input.val!
          s.portal.needchar = 3 - input.val!length
          if input.val!length >= 3 => fetch input.val!
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
        if y < 5 and !s.portal.loading => s.$apply -> fetch input.val!

  ..controller \selecttest, <[$scope]> ++ ($scope) ->
    $scope.blah = [
      {key: 2, displayname: "Kirby", avatar: "team-29"},
      {key: 3, displayname: "PlotDB", avatar: "team-32"},
      {key: 4, displayname: "twstat", avatar: "team-33"},
      {key: 5, displayname: "CWB", avatar: "team-29"}
    ]
    $scope.$watch 'blah', (-> console.log "watch changed: ", it), true
    $scope.gogo = -> $scope.blah = [{key: 123, displayname: '123', id: 123}]

