require! <[nodemailer bluebird nodemailer-mailgun-transport]>
require! <[../../engine/aux]>
require! <[../../secret]>

mailgun = nodemailer.createTransport(nodemailer-mailgun-transport(secret.mailgun))
last-mail-time = null
server-down = false

server-down-warning = -> new bluebird (res, rej) ->
  option = do
    from: '"loading.io Monitor" <monitor@plotdb.com>'
    to: "tkirby@gmail.com"
    subject: "[WARN] loading.io is current down"
    text: """ loading.io is now unable to respond. check https://loading.io/d/health/ to see if it is available.  """
    html: """ loading.io is now unable to respond. check https://loading.io/d/health/ to see if it is available.  """
  (e,i) <- mailgun.sendMail option, _
  if e => console.log e
  if e => return rej(aux.error 500, "failed to send reset password link.. try later?") else res!

ping = ->
  require! <[request]>
  (e,r,b) <- request {
    url: \https://loading.io/d/health
    method: \GET
  }, _
  if b != '{}' =>
    server-down := true
    now = new Date!getTime!
    if !last-mail-time or last-mail-time <= now - 1000 * 60 * 60 =>
      console.log 'server is down'
      last-mail-time := now
      server-down-warning!
  else if server-down =>
    server-down := false
    console.log "server is now online again."

console.log "start to monitor https://loading.io/d/health status..."
setInterval (-> ping!), 1000 * 60 * 1
