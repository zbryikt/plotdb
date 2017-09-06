plotdb = {}
if window? => window.plotdb = plotdb

(->
  if !(Array.from?) =>
    Array.from = (->
      toStr = Object.prototype.toString
      isCallable = (fn) -> typeof(fn) == \function or toStr.call(fn) === '[object Function]'
      toInteger = (value) ->
        number = Number(value)
        if isNaN(number) => return 0
        if number == 0 or !isFinite(number) => return number
        return (if number > 0 => 1 else -1) * Math.floor(Math.abs(number))
      maxSafeInteger = Math.pow(2,53) - 1
      toLength = (value) ->
        len = toInteger value
        return Math.min Math.max(len, 0), maxSafeInteger

      return (arrayLike) ->
        C = this
        items = Object(arrayLike)
        if arrayLike == null => throw new TypeError("Array.from requires an array-like object")
        mapFn = if arguments.length > 1 =>  arguments[1] else undefined
        if typeof(mapFn) !== 'undefined' =>
          if !isCallable(mapFn) =>
            throw new TypeError('Array.from: when provided, the second argument must be a function')
          if arguments.length > 2 => T = arguments[2]
        len = toLength(items.length)
        A = if isCallable(C) => Object(new C(len)) else new Array(len)
        k = 0
        while k < len
          kValue = items[k]
          if mapFn => (A[k] = if typeof(T) == 'undefined' => mapFn(kValue, k) else mapFn.call(T, kValue, k))
          else A[k] = kValue
          k += 1;
        A.length = len;
        return A;
    )!
)!
