require! mongodb

base = do
  r500: (res, error) ->
    console.log "[ERROR] #error"
    res.status(500).json({detail:error})
  r404: (res, msg = "") -> res.status(404)send msg
  r403: (res, msg = "") -> res.status(403)send msg
  r400: (res, msg = "") -> res.status(400)send msg
  r200: (res) -> res.send!
  OID: -> mongodb.ObjectID
  type:
    json: (req, res, next) ->
      res.set('Content-Type', 'application/json')
      next!

module.exports = base
