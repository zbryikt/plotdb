require! <[../backend/aux ../backend/model ../lmodel]>
store = null
module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store
  init = (name) ->
    lmodel[name]rest backend.router.api
    backend.router.api.get "/#name/", (req, res) ->
      (ret) <- lmodel[name].list \owner, [req.user.key] .then
      res.send JSON.stringify(ret)
  for name in <[chart charttype]> => init name

  backend.app.get \/v/chart/:id/, (req, res) -> 
    try
      [location,name,key] = new Buffer(req.params.id, \base64).toString!split \|
      if name != 'chart' and name !='charttype' => throw new Error!
    catch
      return aux.r400 res
    lmodel[name].read key
      ..then (obj) ~>
        res.render 'chart/view.jade', {obj}
      ..catch (err) ~> return aux.r404 res, err
