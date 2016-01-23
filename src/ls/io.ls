angular.module \plotDB
  ..service \IOService, <[$rootScope $http]> ++ ($rootScope, $http) ->
    aux = do
      localkey: -> "#{Math.random!.toString(36)}".substring(2)
      save-locally: (item, res, rej) ->
        list = JSON.parse(localStorage.getItem("/db/list/#{item.type.name}"))
        if !item.key
          for i from 0 til 10 =>
            key = @localkey!
            if !(key in list) => continue
          if i == 10 => return rej [true, "generate local key failed"]
          item.key = key
        if item.key and !(item.key in list) => list.push item.key
        localStorage.setItem("/db/list/#{item.type.name}", angular.toJson(list))
        localStorage.setItem("/db/#{item.type.name}/#{item.key}", angular.toJson(item))
        res item
      save-remotely: (item, res, rej) ->
        config = {data: item} <<< if item.key => 
          {url: "/d/#{item.type.name}/#{item.key}", method: \PUT}
        else {url: "/d/#{item.type.name}", method: \POST}
        $http config
          .success (ret) -> res ret
          .error (d) -> rej [true, d.toString!]
      load-locally: (type, key, res, rej) ->
        ret = JSON.parse(localStorage.getItem("/db/#{type.name}/#{key}"))
        res ret
      load-remotely: (type, key, res, rej) ->
        config = {url: "/d/#{type.name}/#{key}", method: \GET}
        $http config
          .success (ret) -> res ret
          .error (d) -> rej [true, d.toString!]
      list-locally: (type, res, rej) ->
        list = JSON.parse(localStorage.getItem("/db/list/#{type.name}/")) or []
        ret = []
        for item in list =>
          obj = JSON.parse(localStorage.getItem("/db/#{type.name}/#item"))
          if obj => ret.push obj
        res ret
      list-remotely: (type, res, rej) ->
        $http url: "/d/#{type.name}", method: \GET
          .success (ret) -> res ret
          .error (d) -> rej [true, d.toString!]

      verify-type: (item) ->
        if !item or !item.type or typeof(item.type) != \object => return true
        if !item.type.name or !item.type.location => return true
        return false

    ret = do
      save: (item) -> new Promise (res, rej) ~>
        if aux.verify-type(item) => return rej [true, "type incorrect"]
        if item.type.location == \local => return aux.save-locally item, res, rej
        else if item.type.location == \server => return aux.save-remotely item, res, rej
        else return rej [true, "not support type"]
      load: (type, key) -> new Promise (res, rej) ~>
        if aux.verify-type({type}) => return rej [true, "type incorrect"]
        if type.location == \local => return aux.load-locally type, key, res, rej
        else if type.location == \server => return aux.load-remotely type, key, res, rej
        else return rej [true, "not support type"]
      list: (type, filter = {}) -> new Promise (res, rej) ~>
        if aux.verify-type({type}) => return rej [true, "type incorrect"]
        if type.location == \local => return aux.list-locally type, res, rej
        else if type.location == \server => return aux.list-locally type, res, rej
        else if type.location == \any =>
          Promise.all [
            new Promise (res, rej) -> aux.list-locally type, res, rej
            new Promise (res, rej) -> aux.list-remotely type, res, rej
          ] .then (ret) -> res ret.0 ++ ret.1
        else return rej [true, "not support type"]

