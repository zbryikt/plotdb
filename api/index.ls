require! <[fs path]>
require! <[./global ./users ./themes ./charts]>
module.exports = (engine, io) ->
  global engine
  users engine
  themes engine, io
  charts engine, io
