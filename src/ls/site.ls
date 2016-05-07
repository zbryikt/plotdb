angular.module \plotDB
  ..config <[$compileProvider]> ++ ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(blob:|https?:\/\/([a-z0-9]+.)?plotdb\.com\/|https?:\/\/([a-z0-9]+.)plotdb\.io\/|http:\/\/localhost\/|https:\/\/www\.facebook\.com\/|https:\/\/www\.pinterest\.com\/|mailto:\?|http:\/\/www\.linkedin\.com\/|http:\/\/twitter\.com\/)|#/)
  ..service 'eventBus', <[$rootScope]> ++ ($rootScope) ->
    ret = @ <<< do
      queues: {}
      handlers: {}
      process: (name=null) ->
        if !name => list = [[k,v] for k,v of @queues]
        else list = [[name, @queues[][name]]]
        ([k,v]) <~ list.map
        if !v or !v.length => return
        for func in (@handlers[k] or []) => for payload in v => func.apply null, [payload.0] ++ payload.1
        @queues[][name].splice 0, @queues[][name].length
      listen: (name, cb) ->
        @handlers[][name].push cb
        @process name
      fire: (name, payload, ...params) ->
        @queues[][name].push [payload, params]
        @process name

  ..service 'plNotify', <[$rootScope $timeout]> ++ ($rootScope, $timeout) ->
    plNotify = @ <<< do
      queue: []
      send: (type, message) ->
        @queue.push node = {type, message}
        $timeout (~> @queue.splice @queue.indexOf(node), 1), 2900
      alert: (message) ->
        @alert.msg = message
        @alert.toggled = true
    @{}aux.error = do
      io: (name, type, e) ->
        if !e or e.length < 3 => plNotify.send \error, "#name failed."
        else if e.2 == 400 => plNotify.send \error, "#name failed: malformat #type."
        else if e.2 == 403 => plNotify.send \error, "#name failed: permissions denied."
        else if e.2 == 404 => plNotify.send \error, "#name failed: #type doesn't exist."
        else if e.2 == 413 => plNotify.send \error, "#name failed: #type is too large."
        else => plNotify.send \error, "#name failed."
    @

  ..controller \plSite,
  <[$scope $http $interval global plNotify dataService chartService]> ++
  ($scope, $http, $interval, global, plNotify, data-service, chart-service) ->
    $scope.track-event = (cat, act, label, value) -> ga \send, \event, cat, act, label, value
    $scope.notifications = plNotify.queue
    $scope.alert = plNotify.alert
    $scope.nexturl = if /nexturl=([^&]+)/exec((window.location.search or "")) => that.1 else window.location.href
    $scope.user = do
      data: global.user
      authed: -> return @data and @data.key
    $scope.data-service = data-service
    $scope.limitscroll = (node) ->
      prevent = (e) ->
        e.stopPropagation!
        e.preventDefault!
        e.cancelBubble = true
        e.returnValue = false
        return false
      node.addEventListener 'mousewheel', (e) ->
        # http://stackoverflow.com/questions/5802467/prevent-scrolling-of-parent-element
        box = @getBoundingClientRect!
        height = box.height
        scroll = height: @scrollHeight, top: @scrollTop
        if scroll.height <= height => return
        delta = e.deltaY
        do-prevent = false
        on-agent = false
        if e.target and (e.target.id == \field-agent or e.target.parentNode.id == \field-agent) =>
          [on-agent,do-prevent] = [true,true]
        if on-agent =>
          $(@).scrollTop scroll.top + e.deltaY
        else if (-e.deltaY > scroll.top) =>
          $(@).scrollTop 0
          do-prevent = true
        else if (e.deltaY > 0 and (scroll.height - height - scroll.top) <= 0) =>
          do-prevent = true
        return if do-prevent => prevent e else undefined

    $scope.scrollto = (sel = null) ->
      <- setTimeout _, 0
      top = if sel => ( $(sel).offset!top - 60 ) else 0
      $(document.body).animate {scrollTop: top}, '500', 'swing', ->
      $("html").animate {scrollTop: top}, '500', 'swing', ->
    $scope.auth = do
      email: ''
      passwd: ''
      show: false
      stick: false
      toggle: (value) -> @show = if value? => !!value else !@show
      failed: ''
      keyHandler: (e) -> if e.keyCode == 13 => @login!
      loading: false
      logout: ->
        console.log \logout..
        $http do
          url: \/u/logout
          method: \GET
        .success (d) ->
          console.log \logouted.
          $scope.user.data = null
          window.location.reload!
        .error (d) ->
          plNotify.send \danger, 'Failed to Logout. '
      login: ->
        @loading = true
        $http do
          url: \/u/login
          method: \POST
          data: $.param( { email: @email, passwd: @passwd } )
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        .success (d) ~>
          $scope.auth.failed = ''
          $scope.auth.succeed = 'success! ' + (
            if $(\#authpanel).hasClass(\static) => 'redirecting...' else '')
          $scope.user.data = d
          if ga? => ga \set, \&uid, d.key
          @show = false
          if $scope.nexturl => window.location.href = $scope.nexturl
          else if window.location.pathname == '/u/login' => window.location.href = '/'
          # let's see if it's ok to not reload...
          #else window.location.reload!
          @loading = false
        .error (d, code) ~>
          if code == 403 =>
            $scope.auth.failed = if d.[]message.length => d.message.0 else 'email or password incorrect'
          else => $scope.auth.failed = 'system error, please try later'
          @loading = false
        @passwd = ""
    $scope.$watch 'auth.show', (is-show) ->
      if $(\#authpanel).hasClass(\static) => return
      setTimeout (->
        if is-show => $(\#authpanel).modal \show
        else $(\#authpanel).modal \hide
      ), 0
    $(\#authpanel).on \shown.bs.modal, -> $scope.$apply -> $scope.auth.show = true
    $(\#authpanel).on \hidden.bs.modal, -> $scope.$apply -> $scope.auth.show = false

    window.scrollstickers = $(\.scroll-stick)
      ..map ->
        box = @getBoundingClientRect!
        @maxtop = parseInt @.getAttribute("data-top")
        @initval = {top: box.top, left: box.left, width: box.width, height: box.height}

    window.addEventListener \scroll, (it) ->
      scroll-top = $(window).scroll-top!
      if scroll-top < 60 =>
        $(\#nav-top)removeClass \dim
        $(\#subnav-top)removeClass \dim
      else =>
        $(\#nav-top)addClass \dim
        $(\#subnav-top)addClass \dim
      for node in window.scrollstickers =>
        if node.initval.top - scroll-top <= node.maxtop and !node.sticked =>
          node.sticked = true
          node.style.top = "#{node.maxtop}px"
          node.style.width = "#{node.initval.width}px"
          node.style.left = "#{node.initval.left}px"
          $(node).addClass(\sticked)
        else if scroll-top + node.maxtop < node.initval.top and node.sticked =>
          node.sticked = false
          node.style.top = \initial
          $(node).removeClass(\sticked)
    #if ga? => $scope.$watch 'user.data', (-> ga \set, \dimension1, $scope.user.data.key), true

    /* temporarily code for mockup */
    /*
    $scope.charts = []
    list = JSON.parse(localStorage.getItem("/list/charttype"))
    for item in list =>
      chart = JSON.parse(localStorage.getItem("/charttype/#item"))
      $scope.charts.push chart
    */
    #if $scope.charts.length < 10 =>
    #  for i from 0 til 40 => $scope.charts.push {} <<< chart
    $scope.load = (chart) ->
      window.location.href = chartService.link chart
      #"/chart/?k=#{chart.{}type.name or 'local'}|charttype|#{chart.key}"

onSignIn = -> console.log it
