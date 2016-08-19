require! <[sharp fs-extra fs bluebird read-chunk image-type ../engine/aux]>

upload = (type="user", id=0) -> (req, response) ->
  (res, rej) <- new bluebird _
  if !req.files.image or !id => return rej(aux.error 400)
  buf = read-chunk.sync req.files.image.path, 0, 12
  ret = image-type buf
  if !ret => return rej(aux.error 403, "not supported format")

  key = "#{type}-#id"
  if /^[0-9a-fA-F-]+$/.exec(req.user.avatar or "") =>
    fs-extra.remove "static/s/avatar/#{req.user.avatar}.jpg"
  <- fs-extra.mkdirs "static/s/avatar", _
  image = sharp req.files.image.path
  image.metadata!then (meta) ->
    [w,h] = [meta.width, meta.height]
    [w1,h1] = (if w > h => [w * 200 / h, 200] else [200, h * 200 / w]).map(->Math.round it)
    image
      .resize w1, h1
      .extract left: Math.round((w1 - 200)/2), top: Math.round((h1 - 200)/2), width: 200, height: 200
      .toFile "static/s/avatar/#{key}.jpg", (e, info) ->
        if e => return rej(aux.error 500, "Writing avatar failed. maybe try later?")
        res key
    return null
  return null

module.exports = {upload}
