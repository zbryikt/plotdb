require! <[../../../secret ../postgresql pg bluebird]>

init-commentimgs-table = """create table if not exists commentimgs (
  key serial primary key,
  owner int references users(key)
)"""

init-requests-table = """create table if not exists requests (
  key serial primary key,
  owner int references users(key),
  name text constraint nlen check (char_length(name) <= 200),
  config jsonb
)"""

init-comments-table = """create table if not exists comments (
  key serial primary key,
  owner int references users(key),
  request int references requests(key),
  content text,
  main boolean
)"""

init-sessions-table = """create table if not exists sessions (
  key text not null unique primary key,
  detail jsonb
)"""

init-users-table = """create table if not exists users (
  key serial primary key,
  username text constraint nlen check (char_length(username) <= 100),
  password text constraint pwlen check (char_length(password) <= 100),
  usepasswd boolean,
  displayname text, constraint displaynamelength check (chart_length(displayname) <= 100),
  description text,
  datasize int,
  createdtime timestamp,
  lastactive timestamp,
  public_email boolean,
  avatar text,
  detail jsonb
)"""

init-datasets-table = """create table if not exists datasets (
  key serial primary key,
  owner int references users(key),
  parent int references datasets(key),
  name text constraint nlen check (char_length(name) <= 100),
  description text constraint dlen check (char_length(description) <= 500),
  fields jsonb,
  tags text[],
  likes int constraint likecount check ( likes >=0 ),
  searchable boolean,
  createdtime timestamp,
  modifiedtime timestamp,
  rows int,
  size int,
  type text,
  format text,
  config jsonb,
  permission jsonb
)"""

init-datafields-table = """create table if not exists datafields (
  key serial primary key,
  dataset int references datasets(key),
  datasetname text,
  location text,
  name text,
  datatype text,
  hash text,
  data jsonb
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
  createdtime timestamp,
  modifiedtime timestamp,
  doc jsonb,
  style jsonb,
  code jsonb,
  assets jsonb,
  permission jsonb
)"""

init-charts-table = """create table if not exists charts (
  key serial primary key,
  name text,
  owner int references users(key),
  theme int references themes(key),
  parent int references charts(key),
  description text,
  basetype text[],
  visualencoding text[],
  category text[],
  tags text[],
  likes int,
  searchable boolean,
  dimension jsonb,
  dimlen int,
  createdtime timestamp,
  modifiedtime timestamp,
  doc jsonb,
  style jsonb,
  code jsonb,
  assets jsonb,
  permissions jsonb
)"""

alter-themes-table = """alter table theme add column chart int references charts(key)"""

client = new pg.Client secret.io-pg.uri
(e) <- client.connect
if e => return console.log e
console.log "connected"

query = (q) -> new bluebird (res, rej) ->
  (e,r) <- client.query q, _
  if e => rej e
  res r

query init-users-table 
  .then -> query init-sessions-table
  .then -> query init-datasets-table
  .then -> query init-datafields-table
  .then -> query init-themes-table
  .then -> query init-charts-table
  .then -> query init-requests-table
  .then -> query init-comments-table
  .then -> query init-commentimgs-table
  .then -> client.end!
  .catch -> [console.log(it), client.end!]
  
