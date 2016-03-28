require! <[fs path]>
require! <[./global ./users]>
module.exports = (engine) ->
  global engine
  users engine
