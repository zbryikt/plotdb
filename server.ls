require! <[./secret ./engine ./engine/aux ./engine/share/config ./api/]>
require! <[./engine/io/localfs ./engine/io/postgresql/]>

config = aux.merge-config config, secret

pgsql = new postgresql config
/*
lfs = new localfs!
<- lfs.init!then
*/

<- engine.init config, pgsql.authio .then
engine.app.get \/, (req, res) -> res.render 'index.jade'
api engine
engine.start!
