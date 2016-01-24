require! <[../backend/model ../lmodel]>
store = null
module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store
  lmodel.theme.rest backend.router.api
  backend.router.api.get "/theme/", (req, res) ->
    (ret) <- lmodel.theme.list \owner, \null .then
    res.send JSON.stringify(ret)
