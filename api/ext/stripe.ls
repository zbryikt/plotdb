require! <[fs bluebird]>
require! <[../../engine/aux ../../engine/share/model/]>
(router,io) <- (->module.exports = it)  _

#TODO update user session
router.post \/stripe/webhook, (req, res) ->
  console.log req.body
  if !req.body or typeof(req.body) != \object => return aux.r400 res
  (err, event) <- stripe.events.retrieve req.body.id, _
  if err or !event => return aux.r400 res
  console.log JSON.stringify(event)
  console.log
  return res.send!
  if event.type == \charge.succeeded =>
    io.query "cus_92bDMeCbKY8s8m"
    io.query "select * from users where payment->'stripe'->>'id' = $1", [event.data.object.customer]
      .then (r={}) ->
        user = r.[]rows.0
        if !user => return aux.reject 404
        user.payment.active-until = date-offset user.payment.active-until, 0, 1
        io.query "update users set (payment) = $2 where key = $1", [user.key, user.payment]
      .then -> res.send!
      .catch aux.error-handler res

