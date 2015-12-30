if window._backend_ =>
  angular.module \backend
    ..factory \global, <[context]> ++ (context) ->
      delete req.cache
      delete req._locals
      copy = {} <<< context
      context <<< req <<< copy
      req
else
  angular.module \backend, <[]>
    ..factory \global, <[]> ++ ->
      delete req.cache
      delete req._locals
      req
