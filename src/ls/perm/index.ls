angular.module \plotDB
  ..controller \test3,
  <[$scope]> ++ ($scope) ->
    $scope.shown = false
  ..controller \permEdit,
  <[$scope $timeout]> ++ ($scope, $timeout) ->
    $scope.setPerm = ->
      $scope.perm = it or {list: [], switch: 'draft'}
      if !$scope.perm.list => $scope.perm.list = []
      if !$scope.perm.switch => $scope.perm.switch = 'draft'
      $scope.check!
      if $scope.perm.[]list.length == 0 => $scope.add-global!

    # Referemce spec
    $scope.spec = do
      permlist: <[list read comment fork write admin]> #default: all for comment
      switch: <[publish protected draft]>
      type: <[user team global]>
      permission-object: do
        list: do
          * perm: "...", target: "...", type: "..."
        switch: "..."

    $scope.entities = []
    $scope.tab = "publish"
    $scope.perm = do
      list: [
        {target: null, type: "global", perm: "fork", displayname: "Everyone", username: "and anonymous user"},
      ]
      switch: "draft"
    $scope.original = JSON.stringify($scope.perm)
    $scope.permdefault = [
      {target: null, type: "global", perm: "fork", displayname: "Everyone", username: "and anonymous user"}
    ]
    $scope.perm-edit = do
      list: []
      perm: "read"
    $scope.add-token = ->
      token = Math.round(1000000000000000 * Math.random!).toString(36)
      $scope.perm.list.push {
        target: token, type: "token", perm: $scope.perm-edit.perm, displayname: token, username: "token"
      }
    $scope.add-global = ->
      if !$scope.has-global =>
        $scope.perm.list ++= $scope.permdefault
        $scope.has-global = true
    $scope.remove-member = ->
      idx = $scope.perm.list.indexOf it
      if idx < 0 => return
      $scope.perm.list.splice idx, 1
      if $scope.perm.list.length == 0 =>
        $scope.has-global = false
        $scope.add-global!
      else $scope.check!  
    $scope.add-member = ->
      for node in $scope.perm-edit.list =>
        [type,target] = [node.type, node.key]
        matched = $scope.perm.list.filter(-> it.type == type and it.target == +target ).0
        if matched => matched.perm = $scope.perm-edit.perm
        else =>
          ret = do
            target: target, type: type, perm: $scope.perm-edit.perm
            displayname: node.displayname, username: node.type, avatar: node.avatar
          $scope.perm.list.push ret
      $scope.perm-edit.list.splice 0
      obj = {list: $scope.purify!, switch: $scope.perm.switch}
      if JSON.stringify(obj) != $scope.original => $scope.need-save = true
      else $scope.need-save = false
    $scope.purify = ->
      $scope.perm.list.map -> {} <<< it{type, target, perm}
    $scope.check = ->
      $scope.has-global = !!$scope.perm.[]list.filter(->it.type == \global).length
    $scope.check!
    $scope.save = ->
      console.log $scope.perm
