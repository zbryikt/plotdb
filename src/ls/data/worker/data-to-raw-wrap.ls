importScript \/js/data/worker/data-to-raw.js
onmessage = (e) ->
  ret = data-to-raw e
  postMessage {raw: ret}
