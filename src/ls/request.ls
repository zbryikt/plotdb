angular.module \plotDB
  ..service \requestService,
  <[$rootScope $http plConfig sampleChart IOService baseService]> ++
  ($rootScope, $http, plConfig, sampleChart, IOService, baseService) ->
    service = do
      link: (request) -> "/request/#{request.key}/"
    object = (src, lazy = false) ->
      @ <<< do
        name: \untitled
        owner: null
      @ <<< src
      @brief = @content.replace /<[^>]+?>/g, ""
      ret = /<img src="([^"]+)"/.exec(@content,\m)
      @img = (if ret => ret.1 else "")
      @
    requestService = baseService.derive \request ,service, object
    requestService

  ..controller \plRequest,
    <[$scope $timeout $http plNotify]> ++
    ($scope, $timeout, $http, plNotify) ->
      editor = new MediumEditor $('#request-editor .editable').0, do
        toolbar: buttons: <[bold italic underline list-extension]>
        extensions: 'list-extension': new MediumEditorList!
        placeholder: text: 'I want to make a chart of ....'
        mediumEditorList: do
          newParagraphTemplate: '<li>...</li>'
          buttonTemplate: '<b>List</b>'
          addParagraphTemplate: 'Add new paragraph'
          isEditable: true
      $('#request-editor .editable').mediumInsert do
        editor: editor
        addons: do
          images: do
            fileUploadOptions: do
              url: \/d/comment/image
              acceptFileTypes: /(.|\/)(gif|jpe?g|png)$/i
            #TODO need CSRF
            deleteScript: \/d/comment/image
            deleteMethod: \DELETE

      $scope.name = ""
      $scope.config = do
        deadline: new Date!
        ie8: false
        mobile: false
        realtime: false
        static: false

      $scope.submit = ->
        content = editor.serialize()["element-0"].value

        $http do
          url: \/d/request/
          method: \POST
          data: {name: $scope.name, content, config: $scope.config}
        .success (d) ->
          $timeout( ->
            window.location.href = "/request/#{d.request}"
          ), 1000
          plNotify.send \success, "request posted"
        .error ->
          plNotify.send \error, "fail to post request. try again later?"

  ..controller \requestList,
    <[$scope $http plNotify Paging requestService IOService]> ++
    ($scope, $http, plNotify, Paging, requestService, IOService) ->
      $scope.requests = []
      $scope.load-list = (delay = 1000, reset = false) ->
        Paging.load((->
          payload = {} <<< Paging{offset,limit}#<<< $scope.q <<< $scope.q-lazy
          IO-service.list-remotely {name: \request}, payload
        ), delay, reset).then (ret) -> $scope.$apply ~>
          data = (ret or []).map -> new requestService.request it, true
          Paging.flex-width data
          $scope.requests = (if reset => [] else $scope.requests) ++ data
      Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
      $scope.link = -> request-service.link it
      $scope.paging = Paging
      $scope.load-list 500, true
