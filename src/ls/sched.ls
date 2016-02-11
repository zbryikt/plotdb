# SCHED: take over the timeout system
# useful when we don't want to reload page to refresh
# yet can't completely refresh renderer if there is recursive animateFrame

sched = do
  timeout: do
    list: []
    func: window.setTimeout
    set: (func, delta) -> @func.call null, func, delta
  interval: do
    list: []
    func: window.setInterval
    set: (func, delta) -> @func.call null, func, delta
  clear: ->
    for item in @timeout.list => clearTimeout item
    for item in @interval.list => clearInterval item
    for item in @animateframe.list => window.cancelAnimationFrame item
  animateframe: do
    list: []
    func: window.requestAnimationFrame or window.mozRequestAnimationFrame or
          window.webkitRequestAnimationFrame or window.msRequestAnimationFrame
    set: (func) ->
      @func.call window, func


# Chrome refuse to use setInterval in dictionary like ...sched.interval
window.setTimeout = (func, delta) ->
  ret = sched.timeout.set func, delta
  sched.timeout.list.push ret
  ret

window.setInterval = (func, delta) ->
  ret = sched.interval.set func, delta
  sched.interval.list.push ret
  ret

window.requestAnimationFrame = (func) ->
  ret = sched.animateframe.set func
  sched.animateframe.list.push ret
  ret

delete window.mozRequestAnimationFrame
delete window.webkitRequestAnimationFrame
delete window.msRequestAnimationFrame
