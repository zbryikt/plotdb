require! <[../../../secret ../postgresql pg]>

init-sessions-table = """create table if not exists sessions (
  key text not null unique primary key,
  detail jsonb
)"""

init-users-table = """create table if not exists users (
  key serial primary key,
  username text constraint nlen check (char_length(name) <= 100),
  password text constraint pwlen check (char_length(password) <= 100),
  usepasswd boolean,
  displayname text, constraint displaynamelength check (chart_length(displayname) <= 100),
  "createdTime" timestamp,
  "lastActive" timestamp,
  detail jsonb
)"""


#refer to chart is deferred and update using alter table"
init-themes-table = """create table if not exists themes (
  key serial primary key,
  owner int references users(key),
  parent int references themes(key),
  name text constraint nlen check (char_length(name) <= 100),
  description text constraint dlen check (char_length(description) <= 500),
  tags text[],
  likes int constraint likecount check ( likes >=0 ),
  searchable boolean,
  "createdTime" timestamp,
  "modifiedTime" timestamp,
  doc jsonb,
  style jsonb,
  code jsonb,
  assets jsonb,
  permission jsonb
)"""

init-charts-table = """create table if not exists charts (
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
  "createdTime" timestamp,
  "modifiedTime" timestamp,
  payload json
)"""

alter-themes-table = """alter table theme add column chart int references charts(key)"""

client = new pg.Client secret.io-pg.uri
(e) <- client.connect
if e => return console.log e
console.log "connected"

query = (q) -> new Promise (res, rej) ->
  (e,r) <- client.query q, _
  if e => rej e
  res r

query init-users-table 
  .then -> query init-sessions-table
  .then -> query init-themes-table
  .then -> client.end!
  .catch -> [console.log(it), client.end!]
  
