require! <[nodemailer crypto bluebird]>
require! <[../secret]>

m = secret.mail

transport = nodemailer.createTransport("smtps://#{m.auth.user}:#{m.auth.pass}@#{m.host}")

reset-password = (email, token) -> new bluebird (res, rej) ->
  option = do
    from: '"PlotDB Support" <noreply@plotdb.com>'
    to: email
    subject: "Password Reset from PlotDB"
    text: """
You receives this mail because there is a password reset request to PlotDB for this account. If you didn't ask for password reset, please just ignore this mail.

To reset your password, click following link:

  https://plotdb.com/me/passwd/reset/#token
"""
    html: """
<p>You are receiving this mail because there is a password reset request to PlotDB for this account. If you didn't ask for password reset, please just ignore this mail.</p><br>
<p>To reset your password, click following link:<br><br>
&nbsp; &nbsp;<a href="https://plotdb.com/me/passwd/reset/#token">https://plotdb.com/me/passwd/reset/#token</a>
</p>
"""
  (e,i) <- transport.sendMail option, _
  if e => return rej! else res!

module.exports = do
  reset-password: reset-password
