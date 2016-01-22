require! <[../backend/model ../lmodel]>
store = null
module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store
  lmodel.dataset.rest backend.router.api
  backend.router.api.get "/dataset/", (req, res) ->
    (ret) <- lmodel.dataset.list \owner, \null .then
    res.send JSON.stringify(ret)
