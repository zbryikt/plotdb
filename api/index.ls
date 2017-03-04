require! <[fs path]>
require! <[./global ./users ./themes ./charts ./datasets ./requests ./palette ./teams ./admin ./folder ./payment/]>
module.exports = (engine, io) ->
  global engine
  users engine, io
  teams engine, io
  themes engine, io
  charts engine, io
  datasets engine, io
  requests engine, io
  palette engine, io
  admin engine, io
  folder engine, io
  payment engine, io
