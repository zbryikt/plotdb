angular.module \plotDB
  ..service \IOService, <[$rootScope $http]> ++ ($rootScope, $http) ->
    aux = do
      usedkey: {}
      localkey: -> "#{Math.random!.toString(36)}".substring(2)
      save-locally: (item, res, rej) ->
        list = JSON.parse(localStorage.getItem("/db/list/#{item._type.name}")) or []
        if !item.key
          for i from 0 to 10 =>
            key = @localkey!
            if i == 10 or (!(key in list) and !@usedkey[key]) => break
          if i == 10 => return rej [true, "generate local key failed"]
          item.key = key
          @usedkey[key] = true
        if item.key and !(item.key in list) => list.push item.key
        item[if !item.createdtime => "createdtime" else "modifiedtime"] = new Date!getTime!
        localStorage.setItem("/db/list/#{item._type.name}", angular.toJson(list))
        localStorage.setItem("/db/#{item._type.name}/#{item.key}", angular.toJson(item))
        res item
      save-remotely: (item, res, rej) ->
        item[if !item.createdtime => "createdtime" else "modifiedtime"] = new Date!getTime!
        config = {data: item} <<< if item.key => 
          {url: "/d/#{item._type.name}/#{item.key}", method: \PUT}
        else {url: "/d/#{item._type.name}", method: \POST}
        $http config
          .success (ret) -> res ret
          .error (d, status) -> rej [true, d, status]
      load-locally: (_type, key, res, rej) ->
        ret = JSON.parse(localStorage.getItem("/db/#{_type.name}/#{key}"))
        if ret => res(ret <<< {_type}) else rej [true, "no such item"]
      load-remotely: (_type, key, res, rej) ->
        config = {url: "/d/#{_type.name}/#{key}", method: \GET}
        $http config
          .success (ret) -> res(ret <<< {_type})
          .error (d) -> rej [true, d.toString!]
      delete-locally: (_type, key, res, rej) ->
        list = JSON.parse(localStorage.getItem("/db/list/#{_type.name}")) or []
        if !(key in list) => return rej [true, "no such item"]
        list = list.filter(-> it != key)
        localStorage.setItem("/db/list/#{_type.name}", angular.toJson(list))
        localStorage.setItem("/db/#{_type.name}/#{key}", null)
        res!
      delete-remotely: (_type, key, res, rej) ->
        config = {url: "/d/#{_type.name}/#{key}", method: \DELETE}
        $http config
          .success (ret) -> res ret
          .error (d="") -> rej [true, d.toString!]

      verify-type: (item) ->
        if !item or !item._type or typeof(item._type) != \object => return true
        if !item._type.name or !item._type.location => return true
        return false

    ret = do
      aux: aux # one share not use this unless for dev purpose
      save: (item) -> new Promise (res, rej) ~>
        if aux.verify-type(item) => return rej [true, "type incorrect"]
        if item._type.location == \local => return aux.save-locally item, res, rej
        else if item._type.location == \server => return aux.save-remotely item, res, rej
        else return rej [true, "not support type"]
      load: (_type, key) -> new Promise (res, rej) ~>
        if aux.verify-type({_type}) => return rej [true, "type incorrect"]
        if _type.location == \local => return aux.load-locally _type, key, res, rej
        else if _type.location == \server => return aux.load-remotely _type, key, res, rej
        else return rej [true, "not support type"]

      list-locally: (_type) -> new Promise (res, rej) ->
        list = JSON.parse(localStorage.getItem("/db/list/#{_type.name}")) or []
        ret = []
        for item in list =>
          obj = JSON.parse(localStorage.getItem("/db/#{_type.name}/#item"))
          if obj and obj.key => ret.push obj
        res ret
      list-remotely: (_type, query = null) -> new Promise (res, rej) ->
        $http url: "/d/#{_type.name}#{if query => '?'+query else ''}", method: \GET
          .success (ret) -> res ret
          .error (d) -> rej [true, d.toString!]

      /*
      list: (_type, filter = {}) -> new Promise (res, rej) ~>
        if aux.verify-type({_type}) => return rej [true, "type incorrect"]
        if _type.location == \local => return aux.list-locally _type, res, rej
        else if _type.location == \server => return aux.list-remotely _type, res, rej
        else if _type.location == \any =>
          Promise.all [
            new Promise (res, rej) -> aux.list-locally _type, res, rej
            new Promise (res, rej) -> aux.list-remotely _type, res, rej
          ] .then (ret) -> res ret.0 ++ ret.1
        else return rej [true, "not support type"]
      */
      delete: (_type, key) -> new Promise (res, rej) ~>
        if !_type or !key => return rej [true, "param not sufficient"]
        if _type.location == \local => return aux.delete-locally _type, key, res, rej
        else if _type.location == \server => return aux.delete-remotely _type, key, res, rej
        else return rej [true, "not support type"]
      backup: (item) -> new Promise (res, rej) ~>
        path = "/db/backup/#{item._type.name}/#{item.key}"
        # remove 1 hour older backups
        list = JSON.parse(localStorage.getItem("/db/list/backups") or "[]")
        now = new Date!getTime!
        remains = []
        for p in list =>
          timestamp = JSON.parse(localstorage.getItem("#p/timestamp") or 0)
          if now - timestamp > 3600000 =>
            localstorage.removeItem("#p")
            localstorage.removeItem("#p/timestamp")
          else remains.push p
        #TODO think about a mechanism to backup multiple revisions
        # such as difference checking?
        #count = parseInt((localStorage.getItem("#path/count") or 0))
        if remains.indexOf(path) < 0 => remains.push path
        try
          localStorage.setItem("#path", angular.toJson(item))
          localStorage.setItem("#path/timestamp", angular.toJson(new Date!getTime!))
        catch e
          console.log e
        res!
      backups: (item) -> new Promise (res, rej) ~>
        path = "/db/backup/#{item._type.name}/#{item.key}"
        try
          object = JSON.parse(localStorage.getItem("#path") or "{}")
          timestamp = JSON.parse(localStorage.getItem("#path/timestamp") or "0")
          res (if timestamp => [{object, timestamp}] else [])
        catch e
          console.error "failed to parse backups for #{item._type.location} / #{item._type.name} / #{item.key}: \n#e"
          res []
      cleanBackups: (item) -> new Promise (res, rej) ~>
        path = "/db/backup/#{item._type.name}/#{item.key}"
        localStorage.setItem("#path/count", "0")
        res!
