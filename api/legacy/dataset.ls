require! <[../backend/model ../lmodel]>
store = null
module.exports = (backend, config) ->
  store := model.driver.use config.driver
  lmodel := lmodel store
  lmodel.dataset.rest backend.router.api
  backend.router.api.get "/dataset/", (req, res) ->
    if !req.user => return res.send "[]"
    (ret) <- lmodel.dataset.list \owner, [req.user.key] .then
    res.send JSON.stringify(ret)
