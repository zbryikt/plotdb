angular.module \plotDB, <[backend ui.codemirror ngDraggable]>
  ..service 'plNotify', <[$rootScope $timeout]> ++ ($rootScope, $timeout) -> @ <<< do
    queue: []
    send: (type, message) -> 
      @queue.push node = {type, message}
      $timeout (~> @queue.splice @queue.indexOf(node), 1), 2900

  ..controller \plMain, <[$scope $http $interval global plNotify dataService]> ++ ($scope, $http, $interval, global, plNotify, data-service) ->
    $scope.track-event = (cat, act, label, value) -> ga \send, \event, cat, act, label, value
    $scope.notifications = plNotify.queue
    $scope.nexturl = if /nexturl=([^&]+)/exec((window.location.search or "")) => that.1 else window.location.href
    $scope.user = data: global.user
    $scope.data-service = data-service
    $scope.auth = do
      email: ''
      passwd: ''
      show: false
      stick: false
      failed: ''
      keyHandler: (e) -> if e.keyCode == 13 => @login!
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
        $http do
          url: \/u/login
          method: \POST
          data: $.param( { email: @email, passwd: @passwd } )
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        .success (d) ~>
          $scope.auth.failed = ''
          $scope.user.data = d
          if ga? => ga \set, \&uid, d.key
          @show = false
          if $scope.nexturl => window.location.href = $scope.nexturl
          else if window.location.pathname == '/u/login' => window.location.href = '/'
          else window.location.reload!
        .error (d, code) -> 
          if code == 403 => 
            $scope.auth.failed = if d.[]message.length => d.message.0 else 'email or password incorrect'
          else => $scope.auth.failed = 'system error, please try later'
        @passwd = ""
    $scope.$watch 'auth.show', (is-show) -> 
      setTimeout (->
        if is-show => $(\#authpanel).modal \show
        else $(\#authpanel).modal \hide
      ), 0

    window.addEventListener \scroll, (it) -> 
      scroll-top = $(window).scroll-top!
      if scroll-top < 60 => $(\#nav-top)removeClass \dim
      else => $(\#nav-top)addClass \dim
    #if ga? => $scope.$watch 'user.data', (-> ga \set, \dimension1, $scope.user.data.key), true

    /* temporarily code for mockup */
    $scope.charts = [
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
      * name: "Bar Chart", desc: "Bar chart is best for unordered numeric data which ranges widely.", key: \bar
      * name: "Pie Chart", desc: "Pie chart sometimes considered bad but is still great in proportional data", key: \pie
    ]
