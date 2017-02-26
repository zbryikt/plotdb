require! <[fs fs-extra bluebird fs-extra]>
require! <[../../engine/aux ../../engine/share/model/ ../../engine/io/postgresql/]>
require! <[../../secret]>
config = require "../../engine/config/#{secret.config}"

config = aux.merge-config config, secret
bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

params = [2097,{}]
io = new postgresql config

result = {}
# users
io.query("select count(key) as all from users")
  .then (r={}) ->
    result.all = r.rows.0.all
    # users with chart
    io.query("select count(distinct(owner)) as chart from charts")
  .then (r={}) ->
    result.chart = r.rows.0.chart
    # users with chart ...
    io.query("select count(owner) as count,owner from charts group by owner order by count(owner) desc")
  .then (r={}) ->
    # ... which count > 5
    result.multi = r.rows.filter(-> it.count > 5).length
    # users with last month chart
    io.query("select count(key),owner from charts where modifiedtime > CURRENT_DATE - INTERVAL '1 month' group by owner")
  .then (r={}) ->
    # last month chart, registered > 2 months
    io.query("select count(charts.key),charts.owner from charts,users where charts.modifiedtime > CURRENT_DATE - INTERVAL '1 month' and users.key = charts.owner and users.createdtime < CURRENT_DATE - INTERVAL '2 months' group by charts.owner;")
  .then (r={}) ->
    result.active1month = r.rows.length
    # all 2 months users
    io.query("select count(key) as count from users where createdtime < CURRENT_DATE - INTERVAL '2 months'")
  .then (r={}) ->
    result.all2months = r.rows.0.count
    # last week chart, registered > 2 weeks
    io.query("select count(charts.key),charts.owner from charts,users where charts.modifiedtime > CURRENT_DATE - INTERVAL '1 week' and users.key = charts.owner and users.createdtime < CURRENT_DATE - INTERVAL '2 weeks' group by charts.owner;")
  .then (r={}) ->
    result.active1week = r.rows.length
    # all 2 weeks users
    io.query("select count(key) as count from users where createdtime < CURRENT_DATE - INTERVAL '2 weeks'")
  .then (r={}) ->
    result.all2weeks = r.rows.0.count
    # 1 month retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '1 month' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention1m = r.rows.length
    # 2 month retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '2 month' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention2m = r.rows.length
    # 3 month retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '3 month' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention3m = r.rows.length
    # 1week retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '1 week' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention1w = r.rows.length
    # 2week retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '2 weeks' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention2w = r.rows.length
    # 3week retention
    io.query("select count(username),users.key from charts,users where charts.owner = users.key and charts.modifiedtime - users.createdtime > INTERVAL '3 weeks' group by users.key order by count(username) desc")
  .then (r={}) ->
    result.retention3w = r.rows.length

    console.log "Statistics:"
    console.log "users                     :       #{result.all}"
    console.log "users with chart          :       #{result.chart}"
    console.log "users with multiple chart :       #{result.multi}"
    console.log "active users (monthly)    :       #{result.active1month} out of #{result.all2months} ( #{Math.round(1000*result.active1month/result.all2months)/10}% ) "
    console.log "active users (weekly)     :       #{result.active1week} out of #{result.all2weeks} ( #{Math.round(1000*result.active1week/result.all2weeks)/10}% ) "
    console.log "retention: 1 week        :       #{result.retention1w}"
    console.log "retention: 2 week        :       #{result.retention1w}"
    console.log "retention: 3 week        :       #{result.retention2w}"
    console.log "retention: 1 month        :       #{result.retention1m}"
    console.log "retention: 2 month        :       #{result.retention2m}"
    console.log "retention: 3 month        :       #{result.retention3m}"
    console.log "done."
    setTimeout (-> process.exit! ), 1000
