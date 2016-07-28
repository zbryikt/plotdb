require! <[lwip fs-extra fs bluebird read-chunk image-type ../engine/aux]>

upload = (type="user", id=0) -> (req, response) ->
  (res, rej) <- new bluebird _
  if !req.files.image or !id => return rej(aux.error 400)
  buf = read-chunk.sync req.files.image.path, 0, 12
  ret = image-type buf
  if !ret => return rej(aux.error 403, "not supported format")
  (e,img) <- lwip.open req.files.image.path, (ret.ext or '').toLowerCase!, _
  if e => return rej(aux.error 403, "not supported format")
  [w,h] = [img.width!, img.height!]
  [w1,h1] = if w > h => [w * 200 / h, 200] else [200, h * 200 / w]
  img = img.batch!resize(w1,h1).crop(200,200)
  (e,b) <- img.toBuffer \jpg
  if e => return rej(aux.error 500, "failed processing avatar. try later?")
  # use key from md5 ...
  #md5 = crypto.createHash \md5
  #md5.update b
  #key = md5.digest \hex
  # or simply from entity id
  key = "#{type}-#id"
  if /^[0-9a-fA-F-]+$/.exec(req.user.avatar or "") =>
    fs-extra.remove "static/s/avatar/#{req.user.avatar}.jpg"
  <- fs-extra.mkdirs "static/s/avatar", _
  (e) <- fs.write-file "static/s/avatar/#{key}.jpg", b, _
  if e => return rej(aux.error 500, "Writing avatar failed. maybe try later?")
  res key

/*
  query = "update #{if type==\team => \teams else \users} set (avatar) = ($1) where key = $2"
  io.query query, [key, id]
    .then ->
      if type == \user
        req.user.avatar = key
        req.login req.user, -> res.send {avatar: key}
      else res.send {avatar: key}
      return null
    .catch aux.error-handler res
*/

module.exports = {upload}
