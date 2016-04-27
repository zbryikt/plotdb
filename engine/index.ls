require! <[fs path bluebird crypto LiveScript]>
require! <[express body-parser express-session connect-multiparty]>
require! <[passport passport-local passport-facebook passport-google-oauth2]>
require! <[nodemailer nodemailer-smtp-transport]>
require! <[./aux ./watch]>


backend = do
  update-user: (req) -> req.logIn req.user, ->
  #session-store: (backend) -> @ <<< backend.dd.session-store!
  init: (config, authio) -> new bluebird (res, rej) ~>
    @config = config
    session-store = -> @ <<< authio.session
    session-store.prototype = express-session.Store.prototype
    app = express!
    app.use body-parser.json limit: config.limit
    app.use body-parser.urlencoded extended: true, limit: config.limit
    app.set 'view engine', 'jade'
    app.engine \ls, (path, options, callback) ->
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
    app.use \/, express.static(path.join(__dirname, '../static'))
    app.set 'views', path.join(__dirname, '../src/jade/')
    app.locals.basedir = app.get \views

    get-user = (u, p, usep, detail, done) ->
      authio.user.get u, p, usep, detail
        .then -> done null, it
        .catch -> 
          msg = if usep => "incorrect email or password" else "did you login with social account?"
          done null, false, {message: msg}

    passport.use new passport-local.Strategy {
      usernameField: \email
      passwordField: \passwd
    },(u,p,done) ~> get-user u, p, true, null, done

    passport.use new passport-google-oauth2.Strategy(
      do
        clientID: config.google.clientID
        clientSecret: config.google.clientSecret
        callbackURL: "/u/auth/google/callback"
        passReqToCallback: true
        profileFields: ['id', 'displayName', 'link', 'emails']
      , (request, access-token, refresh-token, profile, done) ~>
        get-user profile.emails.0.value, null, false, profile, done
    )

    passport.use new passport-facebook.Strategy(
      do
        clientID: config.facebook.clientID
        clientSecret: config.facebook.clientSecret
        callbackURL: "/u/auth/facebook/callback"
        profileFields: ['id', 'displayName', 'link', 'emails']
      , (access-token, refresh-token, profile, done) ~>
        get-user profile.emails.0.value, null, false, profile, done
    )

    app.use express-session do
      secret: config.session.secret
      resave: true
      saveUninitialized: true
      store: new session-store!
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
        failureRedirect: \/auth/google-fail.html
      ..get \/auth/facebook, passport.authenticate \facebook, {scope: ['email']}
      ..get \/auth/facebook/callback, passport.authenticate \facebook, do
        successRedirect: \/
        failureRedirect: \/auth/fb-fail.html

    postman = nodemailer.createTransport nodemailer-smtp-transport config.mail

    multi = do
      parser: connect-multiparty limit: config.limit
      clean: (req, res, next) ->
        for k,v of req.files => if fs.exists-sync v.path => fs.unlink v.path
      cleaner: (cb) -> (req, res, next) ~>
        if cb => cb req, res, next
        @clean req, res, next

    @ <<< {config, app, express, router, postman, multi}
    res!

  start: (cb) ->
    if !@config.debug => 
      (err, req, res, next) <- @app.use
      -> if err => res.status 500 .render '500' else next!
    if @config.watch => watch.start @config
    server = @app.listen @config.port, -> console.log "listening on port #{server.address!port}"

module.exports = backend
