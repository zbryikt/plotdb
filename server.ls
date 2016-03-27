require! <[./secret ./engine ./engine/aux ./engine/share/config ./api/]>
require! <[./engine/io/localfs]>

config = aux.merge-config config, secret

lfs = new localfs!
<- lfs.init!then

<- engine.init config, lfs.authio .then
engine.app.get \/, (req, res) -> res.render 'index.jade'
api engine
engine.start!
