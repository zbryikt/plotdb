require! <[fs path]>
require! <[./global ./users ./themes ./charts ./datasets ./requests]>
module.exports = (engine, io) ->
  global engine
  users engine, io
  themes engine, io
  charts engine, io
  datasets engine, io
  requests engine, io
