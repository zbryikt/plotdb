require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb ./perm]>
(engine,io) <- (->module.exports = it)  _

stripe = require(\stripe) engine.config.stripe.secret

next-month = (date) ->
  now = if date => new Date(date) else new Date!
  now = new Date!
  y = now.getYear! + 1900
  m = now.getMonth!
  d = now.getDate!
  h = now.getHours!
  M = now.getMinutes!
  s = now.getSeconds! + 1
  new Date(y,m + 1,d,h,M,s)

#TODO update user session
engine.router.api.post \/stripe/webhook, (req, res) ->
  if !req.body or typeof(req.body) != \object => return aux.r400 res
  (err, event) <- stripe.events.retrieve req.body.id, _
  if err or !event => return aux.r400 res
  if event.type == \charge.succeeded =>
    io.query "cus_92bDMeCbKY8s8m"
    io.query "select * from users where payment->'stripe'->>'id' = $1", [event.data.object.customer]
      .then (r={}) ->
        user = r.[]rows.0
        if !user => return aux.reject 404
        user.payment.active-until = next-month user.payment.active-until 
        io.query "update users set (payment) = $2 where key = $1", [user.key, user.payment]
      .then -> res.send!
      .catch aux.error-handler res

engine.router.api.post \/testpay, (req, res) ->
  if !req.user or !req.user.key => return aux.r403 res
  if !req.body or !req.body.id => return aux.r400 res
  if req.user.payment => return aux.r400 res
  token = req.body.token
  console.log "incoming payment: ", req.body
  (err, customer) <- stripe.customers.create {
    source: token, plan: "pro plan", email: req.user.username
  }, _
  console.log err, customer
  if err => return aux.r500 res
  active-until = next-month!
  payment-object = do
    stripe: customer
    active-until: active-until
  io.query "update users set (payment) = ($2) where key = $1", [req.user.key,payment-object]
    .then ->
      req.user.payment = payment-object
      req.login req.user, -> res.send!
      return null
    .catch aux.error-handler res

