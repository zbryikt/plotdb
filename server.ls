require! <[bluebird fs-extra]>
require! <[./secret ./engine ./engine/aux ./api/]>
require! <[./engine/io/localfs ./engine/io/postgresql/]>
config = require "./engine/config/#{secret.config}"

config = aux.merge-config config, secret

bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

pgsql = new postgresql config

#lfs = new localfs!
#<- lfs.init!then

engine.init config, pgsql.authio
  .then ->
    engine.app.get \/, (req, res) -> res.render 'index.jade'
    api engine, pgsql
    engine.app.get \/blah, (req, res) -> res.send []
    engine.start!
  .catch ->
    console.log "[Exception] ", it.stack
