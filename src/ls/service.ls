angular.module \plotDB
  ..service \Paging, <[$rootScope $timeout]> ++ ($rootScope, $timeout) ->
    Paging = do
      session: 0, offset: 0, limit: 20, end: false, loading: false
      handle: null
      load-on-scroll: (cb, beacon) ->
        window.addEventListener \scroll, (v)  ->
          scroll = document.body.scrollTop or document.querySelector("html").scrollTop
          if scroll + window.innerHeight + 50 > $(beacon).offset!top =>
            if !@loading and !@end => $rootScope.$apply ~> cb!

      load: (load, lazy = 500, reset = false) -> new Promise (res, rej) ~>
        if @loading => return res []
        if @handle => $timeout.cancel @handle
        @loading = true
        @handle = $timeout (~>
          if reset => @ <<< {offset: 0, end: false, session: "#{Math.random!}"}
          session = @session
          @handle = null
          load @ .then (ret) ~> $rootScope.$apply ~>
            if session != @session => res []
            if !ret or ret.length == 0 => @end = true
            @ <<< loading: false, offset: @offset + ret.length
            res ret
        ), lazy
      flex-width: (list) ->
        hit = false
        for i from 0 til list.length =>
          d = list[i]
          width = 320
          if Math.random! > 0.6 and !hit =>
            width = (if Math.random! > 0.8 => 960 else 640)
            hit = true
          if i % 3 == 2 =>
            if !hit => width = 640
            hit = false
          d.width = width #if Math.random() > 0.8 => 640 else 320


  ..service \baseService, <[$rootScope IOService eventBus]> ++ ($rootScope, IOService, eventBus) ->
    service-skeleton = do
      type: null # setup once inherited
      items: null
      sample: []

      backup: (item) -> IOService.backup item
      backups: (item) -> IOService.backups item
      cleanBackups: (item) -> IOService.cleanBackups item
      save: (item) ->
        (ret) <~ IOService.save item .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        item.key = ret.key
        idx = @[]items.map(->it.key).indexOf(ret.key)
        if idx < 0 => @[]items.push item
        else @items.splice idx, 1, item
        res item

      load: (_type, key, refresh = false) ->
        filter = ->
          it._type.location == _type.location and it._type.name == _type.name and it.key == key
        # remove later; always fetch from server since we now have summary version of list
        # item = @[]items.filter(filter).0
        # if item => return Promise.resolve(item)
        (ret) <~ IOService.load _type, key .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        item = (@items or[]).filter(filter).0
        if item => item <<< ret
        else if @items => @items.push item = ret
        else @items = [item = ret]
        res item

      delete: (item) ->
        (ret) <~ IOService.delete item._type, item.key .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        idx = @[]items.map(->it.key).indexOf(item.key)
        if idx >= 0 => @items.splice idx, 1
        res ret
      
      /*
      list: (_type, filter = {}, force = false) ->
        if !_type => _type = {location: \any, name: @type}
        if @items and !force => return Promise.resolve(@items)
        if !@items => @items = []
        (ret) <~ IOService.list _type .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        @items.splice 0, @items.length
        @items.concat(ret.map(~>new @Object(it))).concat((@sample or []).map(~> new @Object(it)))
        Array.prototype.splice.apply(
          @items
          [0, ret.length + @sample.length] ++ (ret ++ @sample).map(~>new @Object it)
        )
        res @items
      */

    baseObject = (name, config) ->
      @ <<< do
        _type: {location: \server, name}
        owner: null
        key: null
        permission: {switch: [], value: []}
      @ <<< config

    baseService = do
      wrapper: (name, callee) -> (config) ->
        baseObject.call @, name, config
        callee.call @, config
        @
      derive: (name, service, callee) ->
        service = {} <<< service-skeleton <<< service
        service.type = name
        service[name] = service.Object = @wrapper name, callee
        baseObject.prototype = do
          save: -> service.save @ .then (ret) ~> @key = ret.key
          load: -> service.load @_type, @key .then (ret) ~> @ <<< ret
          delete: -> service.delete @
          clone: ->
            # use JSON parse+stringify to deep clone. be aware of Date format issue:
            # http://stackoverflow.com/questions/122102/5344074
            (new service.Object(JSON.parse(JSON.stringify @))) <<< key: null
          backup: -> service.backup @
          backups: -> service.backups @
          cleanBackups: -> service.cleanBackups @
          recover: (backup) -> @ <<< backup

        service.Object.prototype <<< baseObject.prototype <<< callee.prototype
        callee.prototype = service.Object.prototype
        service

    baseService
