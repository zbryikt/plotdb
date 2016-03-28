require! <[../../../secret ../postgresql pg]>

sessions-table = """create table if not exists sessions (
  key text not null unique primary key,
  detail jsonb
)"""
users-table = """create table if not exists users (
  key serial primary key,
  username text,
  password text,
  usepasswd boolean,
  displayname text,
  createdTime timestamp,
  detail jsonb
)"""

themes-table = """create table if not exists themes (
  key serial primary key,
  name text,
  description text,
  tags text[],
  likes int,
  createdTime timestamp,
  modifiedTime timestamp,
  payload json
)"""

charts-table = """create table if not exists charts (
  key serial primary key,
  owner int references users(key),
  theme int references themes(key),
  name text,
  description text,
  basetype text,
  visualencoding text[],
  category text[],
  tags text[],
  likes int,
  dimlen int,
  createdTime timestamp,
  modifiedTime timestamp,
  payload json
)"""

client = new pg.Client secret.io-pg.uri
(e) <- client.connect
if e => return console.log e
console.log "connected"

query = (q) -> new Promise (res, rej) ->
  (e,r) <- client.query q, _
  if e => rej e
  res r

query users-table 
  .then -> query sessions-table
  .then -> client.end!
  
