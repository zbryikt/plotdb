importScripts \/js/data/worker/grid-render.js
onmessage = (e) ->
  ret = grid-render e
  postMessage ret
