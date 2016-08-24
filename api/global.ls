require! <[jsonwebtoken ../secret ../engine/aux crypto]>

(engine) <- (->module.exports = it)  _

# verification: ret = jsonwebtoken.verify token, secret.token-secret
random = (count) ->
  chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789-_.!*()"
  rnd = crypto.randomBytes(count)
  val = new Array(count)
  len = chars.length
  for i from 0 til count => val[i] = chars[rnd[i] % len]
  val = val.join('')
  token = jsonwebtoken.sign val, secret.token-secret
  token

engine.app.get( \/global, engine.csrfProtection,
  (req, res) ->
    res.setHeader \content-type, \application/javascript
    #inline js to speed up.
    #res.render \view/global.ls, {user: req.user, global: true, csrfToken: req.csrfToken!}
    payload = JSON.stringify({user: req.user, global: true, csrfToken: req.csrfToken!})
    delete req.user.{}payment.strip
    res.send """(function() { var req = #payload;
    if(window._backend_) { angular.module("backend").factory("global",["context",function(context){
      var own={}.hasOwnProperty,key;
      for (key in req) if (own.call(req, key)) context[key] = req[key];
      return req;
    }]); }else{
      angular.module("backend",[]).factory("global",[function(){return req;}]);
    }})()"""
)

# currently we dont use this instead use Math.random! in browser.
# perhaps switch to this in the future?
engine.router.api.get \/random-token, (req, res) -> res.send random 16
