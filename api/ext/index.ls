require! <[./charts ./stripe express]>

module.exports = (engine, io) ->
  router = new express.Router()
  stripe engine, router, io
  charts engine, router, io
  router

