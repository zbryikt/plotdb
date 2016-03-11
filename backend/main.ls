require! <[fs path child_process express mongodb body-parser crypto chokidar]>
require! <[passport passport-local passport-facebook passport-google-oauth2 express-session]>
require! <[nodemailer nodemailer-smtp-transport LiveScript]>
require! <[connect-multiparty]>
require! <[./aux ./watch]>

lsc = (path, options, callback) ->
  opt = {} <<< options
  delete opt.settings
  delete opt.basedir
  try
    source = fs.read-file-sync path .toString!
    result = LiveScript.compile source
    [err,ret] = [null, "(function(){var req = #{JSON.stringify(opt)};#result;}).call(this);"]
  catch e
    [err,ret] = [e,""]
  callback err, ret

backend = do
  # data driver. initialized in init, determined by config
  dd: null

  # wrapper or http request handler for checking if is logined as staff 
  authorized: (cb) -> (req, res) ->
    if not (req.user and req.user.isStaff) => return res.status(403).render('403', {url: req.originalUrl})
    cb req, res

  # need login
  needlogin: (cb) -> (req, res) ->
    if not (req.user) => return res.status(403).render('403', {url: req.originalUrl})
    cb req, res

  update-user: (req) -> req.logIn req.user, ->

  # sample configuration
  config: -> {}

  newUser: (username, password, usepasswd, detail) ->
    displayname = if detail => detail.displayName or detail.username else username.replace(/@.+$/, "")
    user = {username, password, usepasswd, displayname, detail, create_date: new Date!}

  getUser: (username, password, usepasswd, detail, done) ->
    password = if usepasswd => crypto.createHash(\md5).update(password).digest(\hex) else ""
    @dd.get-user username, password, usepasswd, detail, @newUser, done

  session-store: (backend) -> @ <<< backend.dd.session-store!

  init: (config, driver, cb) ->
    config = {} <<< @config! <<< config
    @dd = driver
    aux <<< driver.aux

    @session-store.prototype = express-session.Store.prototype

    app = express!
    app.use body-parser.json limit: config.limit
    app.use body-parser.urlencoded extended: true, limit: config.limit
    cb app
    app.set 'view engine', 'jade'
    app.engine \ls, lsc
    app.use \/, express.static(path.join(__dirname, '../static'))
    app.set 'views', path.join(__dirname, '../view')
    app.locals.basedir = app.get \views

    passport.use new passport-local.Strategy {
      usernameField: \email
      passwordField: \passwd
    },(u,p,done) ~> @getUser u, p, true, null, done

    passport.use new passport-google-oauth2.Strategy(
      do
        clientID: config.google.clientID
        clientSecret: config.google.clientSecret
        callbackURL: "/u/auth/google/callback"
        passReqToCallback: true
      , (request, access-token, refresh-token, profile, done) ~>
        @getUser profile.emails.0.value, null, false, profile, done
    )

    passport.use new passport-facebook.Strategy(
      do
        clientID: config.facebook.clientID
        clientSecret: config.facebook.clientSecret
        callbackURL: "/u/auth/facebook/callback"
        profileFields: ['id', 'displayName', 'link', 'emails']
      , (access-token, refresh-token, profile, done) ~>
        @getUser profile.emails.0.value, null, false, profile, done
    )

    app.use express-session do
      secret: config.session-secret
      resave: true
      saveUninitialized: true
      store: new @session-store @
      cookie: do
        #secure: true # TODO: https. also need to dinstinguish production/staging
        path: \/
        httpOnly: true
        maxAge: 86400000 * 30 * 12 #  1 year
        domain: config.cookie.domain if config.{}cookie.domain
    app.use passport.initialize!
    app.use passport.session!

    passport.serializeUser (u,done) -> done null, JSON.stringify(u)
    passport.deserializeUser (v,done) -> done null, JSON.parse(v)

    router = do
      user: express.Router!
      api: express.Router!

    app
      ..use "/d", router.api
      ..use "/u", router.user
      ..get "/d/health", (req, res) -> res.json {}

    router.user
      ..get \/null, (req, res) -> res.json {}
      ..get \/me, (req,res) ->
        info = if req.user => req.user{email} else {}
        res.set("Content-Type", "text/javascript").send(
          "angular.module('main').factory('user',function() { return "+JSON.stringify(info)+" });"
        )
      ..get \/200, (req,res) -> res.json(req.user)
      ..get \/403, (req,res) -> res.status(403)send!
      ..get \/login, (req, res) -> res.render \login
      ..post \/login, passport.authenticate \local, do
        successRedirect: \/u/200
        failureRedirect: \/u/403
      ..get \/logout, (req, res) ->
        req.logout!
        res.redirect \/
      ..get \/auth/google, passport.authenticate \google, {scope: ['email']}
      ..get \/auth/google/callback, passport.authenticate \google, do
        successRedirect: \/
        failureRedirect: \/u/403
      ..get \/auth/facebook, passport.authenticate \facebook, {scope: ['email']}
      ..get \/auth/facebook/callback, passport.authenticate \facebook, do
        successRedirect: \/
        failureRedirect: \/u/403

    postman = nodemailer.createTransport nodemailer-smtp-transport config.mail

    multi = do
      parser: connect-multiparty limit: config.limit
      clean: (req, res, next) ->
        for k,v of req.files => if fs.exists-sync v.path => fs.unlink v.path
      cleaner: (cb) -> (req, res, next) ~>
        if cb => cb req, res, next
        @clean req, res, next

    @ <<< {config, app, express, router, postman, multi}

  start: (cb) ->
    <~ @dd.init @config
    @ <<< it
    if !@config.debug => @app.use (err, req, res, next) -> if err => res.status 500 .render '500' else next!
    if @config.watch => watch.start!
    server = @app.listen @config.port, -> console.log "listening on port #{server.address!port}"
    cb @

module.exports = {backend, aux}
