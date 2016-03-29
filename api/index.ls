require! <[fs path]>
require! <[./global ./users ./themes ./charts ./dataset]>
module.exports = (engine, io) ->
  global engine
  users engine
  themes engine, io
  charts engine, io
  dataset engine, io
