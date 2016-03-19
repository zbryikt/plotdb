angular.module \plotDB
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

      load: (type, key, refresh = false) ->
        filter = ->
          it.type.location == type.location and it.type.name == type.name and it.key == key
        # remove later; always fetch from server since we now have summary version of list
        # item = @[]items.filter(filter).0
        # if item => return Promise.resolve(item)
        (ret) <~ IOService.load type, key .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        item = (@items or[]).filter(filter).0
        if item => item <<< ret
        else if @items => @items.push item = ret
        else @items = [item = ret]
        res item

      delete: (item) ->
        (ret) <~ IOService.delete item.type, item.key .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        idx = @[]items.map(->it.key).indexOf(item.key)
        if idx >= 0 => @items.splice idx, 1
        res ret

      list: (type, filter = {}, force = false) ->
        if !type => type = {location: \any, name: @type}
        if @items and !force => return Promise.resolve(@items)
        if !@items => @items = []
        (ret) <~ IOService.list type .then
        (res, rej) <~ new Promise _
        <~ $rootScope.$apply-async
        @items.splice 0, @items.length
        @items.concat(ret.map(~>new @Object(it))).concat((@sample or []).map(~> new @Object(it)))
        Array.prototype.splice.apply(
          @items
          [0, ret.length + @sample.length] ++ (ret ++ @sample).map(~>new @Object it)
        )
        res @items

    baseObject = (config) -> @ <<< config

    baseService = do
      wrapper: (callee) -> (config) ->
        baseObject.call @, config
        callee.call @, config
        @
      derive: (name, service, callee) ->
        service = {} <<< service-skeleton <<< service
        service.type = name
        service[name] = service.Object = @wrapper callee

        baseObject.prototype = do
          type: {location: \server, name}
          owner: null
          key: null
          permission: {switch: [], value: []}
          save: -> service.save @ .then (ret) ~> @key = ret.key
          load: -> service.load @type, @key .then (ret) ~> @ <<< ret
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
