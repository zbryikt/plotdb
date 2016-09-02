require! <[./stripe express]>

module.exports = (engine, io) ->
  router = new express.Router()
  stripe engine, router, io
  router

