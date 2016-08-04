require! <[fs bluebird fs-extra]>
require! <[../engine/aux ../engine/share/model/ ../engine/io/postgresql/]>
require! <[../secret]>
config = require "../engine/config/#{secret.config}"

config = aux.merge-config config, secret
bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

io = new postgresql config

patch = (r={}) ->
  list = r.[]rows
  for item in list
    if typeof(item.{}permission.switch) == \string => continue
    /*if item.searchable =>
      item.permission = {list: [{target: null, type: "global", perm: "fork"}], switch: "publish"}
    else 
      item.permission = {list: [], switch: "draft"}*/
    ret = {switch: "draft", list: []}
    perm = item.{}permission.[]value.0
    if item.{}permission.[]switch.indexOf(\public)>=0 => ret.switch = "publish"
    if perm and perm.perm == \fork => ret.list = [{target: null, type: "global", perm: "fork"}]
    item.permission = ret
  return list


io.query "select key,permission,searchable from charts"
  .then patch
  .then (items)-> 
    promises = items.map (item) ->
      io.query "update charts set (permission) = ($2) where key = $1", [item.key, item.permission]
    bluebird.all promises
  .then -> console.log \ok

io.query "select key,permission,searchable from themes"
  .then patch
  .then (items)-> 
    promises = items.map (item) ->
      io.query "update themes set (permission) = ($2) where key = $1", [item.key, item.permission]
    bluebird.all promises
  .then -> console.log \ok

io.query "select key,permission,searchable from datasets"
  .then patch
  .then (items)-> 
    promises = items.map (item) ->
      io.query "update datasets set (permission) = ($2) where key = $1", [item.key, item.permission]
    bluebird.all promises
  .then -> console.log \ok
#io.query """select member,team from teammembers where team = any($1) limit 10""", [[32,33]]
#  .then (r={}) -> console.log r.[]rows

/*
io.query """
select * from (
select member, team, row_number() over (partition by team order by member) as r from teammembers
where team = any($1)
) x where x.r <= 2
""", [[32,33]]
  .then (r={}) -> console.log r.[]rows
*/

/*
io.query """
select tm.member,tm.team,users.avatar from users,(
select member,team,row_number() over (partition by team order by member) as r
from teammembers where team = any($1)
) tm where tm.r <= 10 and users.key = tm.member
""", [[32,33]]
  .then (r={}) -> console.log r.[]rows
*/

#io.query """
#select key,count(teammembers.member) from teams,teammembers where teams.key=teammembers.team group by teams.key
#"""
#  .then (r={})-> console.log r.[]rows
