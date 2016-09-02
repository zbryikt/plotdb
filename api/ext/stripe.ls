require! <[fs bluebird]>
require! <[../../engine/aux ../../engine/share/model/]>
(engine,router,io) <- (->module.exports = it)  _

stripe = require(\stripe) engine.config.stripe.secret

handler = do
  invoice: do
    _payment_info: (event) ->
      payload = event.{}data.{}object
      data = payload.{}lines.{}data.0 or {}
      expiredate = new Date(data.period.end * 1000)
      amount = data.amount
      date = new Date(payload.date * 1000)
      id = payload.id
      plan = data.plan.name
      {data, expiredate, amount, date, id, plan}
    payment_succeeded: (req, res, event) ->
      data = @_payment_info event
      console.log "payment succeeded [#{data.id}]:"
      console.log "  $#{data.amount} for #{data.plan} at #{data.date}, expire after #{data.expiredate}"
      io.query "select key,payment from users where payment->'stripe'->>'id' = $1", [event.data.object.customer]
        .then (r={}) ->
          user = r.[]rows.0
          if !user => return aux.reject 404
          user.payment.expiredate = data.expiredate
          promises = [
            io.query("update users set (payment) = $2 where key = $1", [user.key, user.payment]),
            io.query("select key,detail from sessions where (detail #>> '{passport,user,key}')::numeric = $1",[id])
              .then (r={}) ->
                ret = r.[]rows.0
                if !ret => return null
                ret.{}detail.{}passport.{}user.teams = teams
                io.query "update sessions set (detail) = ($2) where key = $1", [ret.key, ret.detail]
              .catch -> return aux.reject 500
          ]
          bluebird.all promises
        .then -> res.send!
        .catch aux.error-handler res
    payment_failed: (req, res, event) ->
      data = @_payment_info event
      console.log "payment failed [#{data.id}]:"
      console.log "  $#{data.amount} for #{data.plan} at #{data.date}, expire after #{data.expiredate}"
      res.send!

router.post \/stripe/webhook, (req, res) ->
  if !req.body or typeof(req.body) != \object => return aux.r400 res
  #turn on in production
  #(err, event) <- stripe.events.retrieve req.body.id, _
  #if err or !event => return aux.r400 res
  event = req.body
  console.log event.type
  type = event.type.split \.
  h = handler
  while type.length and h
    h = h[type.0]
    type.splice 0,1
  if h => return h req, res, event
  else return res.send!
