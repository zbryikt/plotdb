require! <[../backend/model ../lmodel]>
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
