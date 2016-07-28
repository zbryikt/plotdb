angular.module \plotDB
  ..controller \profile,
  <[$scope $http global plNotify dataService chartService themeService]> ++
  ($scope, $http, global, plNotify, data-service, chart-service, theme-service) ->
    /*data-service.list!then (ret) -> $scope.$apply ->
      $scope.datasets = ret
      d3.select \#dataset-number .transition!duration 1000
        .tween \text, -> -> @textContent = parseInt($scope.datasets.length * it)
    */
    /*
    theme-service.list!then (ret) -> $scope.$apply ->
      $scope.themes = ret
      d3.select \#theme-number .transition!duration 1000
        .tween \text, -> -> @textContent = parseInt($scope.themes.length * it)
    chart-service.list!then (ret) -> $scope.$apply ->
      $scope.charts = ret
      d3.select \#chart-number .transition!duration 1000
        .tween \text, -> -> @textContent = parseInt($scope.charts.length * it)
    */
    $scope.profile = window.profileUser
    $scope.passwd = do
      oldOne: ''
      newOne: ''
      update: ->
        $http do
          url: "/d/me/passwd/"
          method: \POST
          data: {newpasswd: $scope.passwd.newOne, oldpasswd: $scope.passwd.oldOne}
        .success (d) ->
          plNotify.send \success, "Password changed."
        .error (d) ->
          plNotify.send \success, "Password changing failed, try again later"
    $scope.avatar = do
      update: (node) ->
        # TODO error message
        if node.files.length == 0 => return
        if !(/image\//.exec node.files.0.type) =>
          plNotify.send \danger, "Wrong file type, use image instead."
          return
        if node.files.0.size >= 1048576 =>
          plNotify.send \danger, "File too large. try another instead. (<1MB) "
          return
        plNotify.send \warning, "Uploading avatar..."
        fr = new FileReader!
        fr.onload = ->
          raw = new Uint8Array @result
          fd = new FormData!
          fd.append \image, new Blob([raw], {type: "application/octet-stream"})
          $http do
            url: \/d/me/avatar
            method: \POST
            data: fd
            transformRequest: angular.identity
            headers: "Content-Type": undefined
          .success (d) ->
            plNotify.send \success, "Avatar Changed."
            $scope.user.data.avatar = d.avatar
            $scope.profile.avatar = d.avatar
          .error (d) ->
            plNotify.send \danger, "Image can't be used, use another image",
        fr.read-as-array-buffer node.files.0
    $scope.update = ->
      $http do
        url: "/d/user/#{$scope.profile.key}"
        method: \PUT
        data: $scope.profile
      .success (d) ->
        plNotify.send \success, "Profile updated."
      .error (d) ->
        plNotify.send \danger, "Failed: #{d.msg}"
