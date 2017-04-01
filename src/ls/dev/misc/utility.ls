angular.module \plotDB
  # initWrap: helper to initialize and build promise object
  ..service \initWrap, <[$rootScope]> ++ ($rootScope) ->
    init = -> init.[]list.push it; it <<< do
      promise: {}
      finish: (name='default', ...payload) ->
        if !@promise[name] => return
        res = @promise[name].res
        @promise[name] = null
        res.apply null, payload
      block: (name='default')-> new Promise (res, rej) ~> @promise[name] = {res, rej}
    init <<< run: -> init.[]list.map -> it.init!

  ..directive \pldialog, <[$compile]> ++ ($compile) -> do
    restrict: \A
    scope: do
      model: \=ngModel
    link: (s,e,a,c) -> 
      s.model.ctrl = ctrl = do 
        promise: null
        focus: -> 
          n = e.find("input[tabindex='1']")
          if n.length => n.focus!
        toggle: (t,v) ->
          @toggled = if t => t else !@toggled
          if v => @value = v
          @focus!
        toggled: false
        value: null
        reset: -> @value = ''
        init: ->
          @reset!
          e.on \keydown, (event) -> 
            key = event.keyCode or event.which
            if key != 13 => return
            tabindex = +event.target.getAttribute("tabindex") + 1
            n = e.find("input[tabindex='#{tabindex}']")
            if n.length => n.focus! else s.$apply -> s.model.action 'done'
      s.model.action = (a) ->
        if a == 'done' => s.model.value = ctrl.value
        ctrl.toggle false
        if ctrl.promise =>
          if a == 'done' => ctrl.promise.res ctrl.value else ctrl.promise.rej a
          ctrl.promise = null
      s.model.prompt = (v) ->
        s.$apply -> ctrl.toggle true, v
        new Promise (res, rej) ~> ctrl.promise = {res, rej}
      s.model.ctrl.init!
