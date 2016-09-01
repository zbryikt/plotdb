require! <[./stripe express]>

module.exports = (engine, io) ->
  router = new express.Router()
  stripe router, io
  router

