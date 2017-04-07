require! <[fs fs-extra]>

dethumb = (chart) ->
  if !chart.thumbnail => return [null, null]
  thumb = chart.thumbnail.split('base64,')
  if !thumb => return [null, null]
  ret = /data:([^;]+);/.exec(thumb.0)
  if !ret => return [null, null]
  delete chart.thumbnail
  [type, thumb] = [ret.1, new Buffer(thumb.1, 'base64')]

module.exports = do
  save: (type='chart', data) ->
    if !data => return
    [imgtype, thumb] = dethumb data
    if imgtype != \image/png or !thumb => return
    if data.key => fs-extra.mkdirs "static/s/#type", ->
      fs.write-file "static/s/#{type}/#{data.key}.png", thumb, (->)
