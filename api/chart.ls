require! <[fs path ../backend/aux ../backend/model ../lmodel]>
themeSample = require '../src/ls/theme/sample'
store = null

mkdir-recurse = ->
  if !fs.exists-sync(it) =>
    mkdir-recurse path.dirname it
    fs.mkdir-sync it
mkdir-recurse "static/s/chart"

module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store

  dethumb = (chart) ->
    thumb = chart.thumbnail.split('base64,')
    ret = /data:([^;]+);/.exec(thumb.0)
    if !ret => return null
    delete chart.thumbnail
    [type, thumb] = [ret.1, new Buffer(thumb.1, 'base64')]

  backend.router.api.post "/chart/", (req, res) ~>
    if !req.user => aux.r403 res
    data = req.body
    data <<< {owner: req.user.key, key: null}
    [type, thumb] = dethumb data
    if data.key => fs.write-file "static/s/chart/#{data.key}", thumb
    ret = lmodel.chart.lint(data)
    if ret.0 => return aux.r400 res, ret
    data = lmodel.chart.clean data
    data.save!then (ret) -> res.send ret

  backend.router.api.put "/chart/:id", (req, res) ~>
    if !req.user => aux.r403 res
    data = req.body
    if !data.key == req.params.id => return aux.r400 res, [true, data.key, \key-mismatch]
    lmodel.chart.read req.params.id
      ..then (ret) ~>
        if !ret => return aux.r404 res
        data = req.body
        if ret.owner != req.user.key => return aux.r403 res
        data <<< owner: req.user.key, key: req.params.id
        [type, thumb] = dethumb data
        if data.key => fs.write-file "static/s/chart/#{data.key}", thumb
        ret = lmodel.chart.lint(data)
        if ret.0 => return aux.r400 res, ret
        data = lmodel.chart.clean data
        data.save!then (ret) -> res.send ret
      ..catch -> return aux.r403 res

  # overwrite post and put, use remaining method
  lmodel.chart.rest backend.router.api

  backend.router.api.get "/chart/", (req, res) ->
    # TODO optimization
    if req.query.q == 'all'
      (ret) <- lmodel.chart.list!then
      ret = ret.filter(->it.{}permission.[]value.filter(->it.perm == \fork and it.switch == \public).length)
      (users) <- model.type.user.list(\key,ret.map(-> it.owner)filter(->it))then
      users = users.map -> [it.key, it.displayname]
      ret.forEach (chart) -> chart.ownerName = (users.filter(-> it.0 == chart.owner).0 or []).1
      res.send JSON.stringify(ret)
    else
      if !req.user => return res.send "[]"
      (ret) <- lmodel.chart.list \owner, [req.user.key] .then
      res.send JSON.stringify(ret)

  backend.app.get \/v/chart/:id/, (req, res) -> 
    lmodel.chart.read req.params.id
      ..then (chart) ~>
        obj = {chart, theme: null}
        #TODO support more sophisticated permission chechking
        if !("public" in chart.{}permission.[]switch) => return aux.r403 res, "this chart is private", true
        if chart.theme =>
          ret = themeSample.filter(-> it.key == chart.theme).0
          if ret =>
            obj.theme = ret
            return res.render 'chart/view.jade', obj

          lmodel.theme.read chart.theme
            ..then (theme) ~>
              obj.theme = theme
              res.render 'chart/view.jade', obj
            ..catch (err) ~> res.render 'chart/view.jade', obj
        else res.render 'chart/view.jade', obj
      ..catch (err) ~> return aux.r404 res, err

  backend.app.get \/v/chart/:id/thumb, (req, res) ->
    lmodel.chart.read req.params.id
      ..then (chart) ~>
        #TODO support more sophisticated permission chechking
        #TODO should return image
        if !("public" in chart.{}permission.[]switch) => return aux.r403 res, "this chart is private", true
        chart.thumbnail.split(\,).1
        try
          res.set('Content-Type', 'image/png')
          output = new Buffer(chart.thumbnail.split(\,).1, \base64)
        catch e
          output = ""
        res.send output
      ..catch (err) ~> return aux.r404 res, err

  backend.router.api.put \/chart/:id/like, (req, res) ->
    lmodel.chart.read req.params.id
      ..then (chart) ~>
        chart = lmodel.chart.clean(chart)
        if !("public" in chart.{}permission.[]switch) => return aux.r403 res, "this chart is private", true
        if !req.user => return aux.r403 res
        v = req.user.{}likes.{}chart[chart.key] = !req.user.{}likes.{}chart[chart.key]
        chart.likes = (if chart.likes? => chart.likes else 0) + (if v => 1 else -1) >? 0
        (ret) <- chart.save!then
        user = {} <<< req.user
        user = model.type.user.clean(user)
        user.save!then (ret) -> req.login user, -> res.send ret
      ..catch (err) ~> return aux.r404 res, err
