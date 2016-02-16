require! <[../backend/aux ../backend/model ../lmodel]>
store = null
module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store
  lmodel.chart.rest backend.router.api
  backend.router.api.get "/chart/", (req, res) ->
    # TODO optimization
    if req.query.q == 'all'
      (ret) <- lmodel.chart.list!then
      ret = ret.filter(->it.{}permission.[]value.filter(->it.perm == \fork and it.switch == \public).length)
      res.send JSON.stringify(ret)
    else
      (ret) <- lmodel.chart.list \owner, [req.user.key] .then
      res.send JSON.stringify(ret)

  backend.app.get \/v/chart/:id/, (req, res) -> 
    lmodel.chart.read req.params.id
      ..then (obj) ~>
        #TODO support more sophisticated permission chechking
        if !("public" in obj.{}permission.[]switch) => return aux.r403 res, "this chart is private", true
        if obj.theme =>
          lmodel.theme.read obj.theme
            ..then (theme) ~>
              obj.theme = theme
              res.render 'chart/view.jade', {obj}
            ..catch (err) ~> res.render 'chart/view.jade', {obj}
        else res.render 'chart/view.jade', {obj}
      ..catch (err) ~> return aux.r404 res, err
