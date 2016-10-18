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
  displayname text, constraint displaynamelength check (char_length(displayname) <= 100),
  description text,
  datasize int,
  createdtime timestamp,
  lastactive timestamp,
  public_email boolean,
  avatar text,
  detail jsonb,
  payment jsonb
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
  permission jsonb,
  config jsonb,
  library text[],
  local jsonb
)"""

alter-charts-table = """
do $$
  begin
    begin
      alter table charts add column inherit text[];
    exception
      when duplicate_column then raise notice '';
    end;
  end;
$$
"""


init-likes-table = """create table if not exists likes (
  key serial primary key,
  type text,
  owner int references users(key),
  uid int
)"""

init-palettes-table = """create table if not exists palettes (
  key serial primary key,
  name text,
  owner int references users(key),
  description text,
  colors jsonb,
  createdtime timestamp,
  modifiedtime timestamp,
  permission jsonb
)"""

init-teams-table = """create table if not exists teams (
  key serial primary key,
  name text constraint nlen check (char_length(name) <= 100),
  owner int references users(key),
  description text constraint dlen check (char_length(name) <= 500),
  createdtime timestamp,
  modifiedtime timestamp,
  avatar text,
  permission jsonb
)"""

init-team-members-table = """create table if not exists teamMembers (
  team int references teams(key),
  member int references users(key),
  primary key(team, member)
)"""

init-team-charts-table = """create table if not exists teamcharts (
  team int references teams(key),
  chart int references charts(key),
  primary key(team, chart)
)"""

init-team-datasets-table = """create table if not exists teamdatasets (
  team int references teams(key),
  dataset int references datasets(key),
  primary key(team, dataset)
)"""

init-team-themes-table = """create table if not exists teamthemes (
  team int references teams(key),
  theme int references themes(key),
  primary key(team, theme)
)"""

init-payment-history-table = """create table if not exists paymenthistory (
  owner int references users(key),
  status int,
  id text,
  date timestamp,
  amount int,
  plan text,
  method text
)"""

alter-themes-table = """
do $$
  begin
    begin
      alter table themes add column chart int references charts(key);
    exception
      when duplicate_column then raise notice '';
    end;
  end;
$$
"""

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
  .then -> query alter-charts-table
  .then -> query init-palettes-table
  .then -> query init-requests-table
  .then -> query init-comments-table
  .then -> query init-likes-table
  .then -> query init-commentimgs-table
  .then -> query init-teams-table
  .then -> query init-team-members-table
  .then -> query init-team-charts-table
  .then -> query init-team-datasets-table
  .then -> query init-team-themes-table
  .then -> query init-payment-history-table
  .then ->
    query alter-themes-table
      .catch ->
        console.log "alter table themes encounter following issue:"
        console.log it
        console.log "continue since it might not be a problem"
  .then ->
    console.log "done."
    client.end!
  .catch -> [console.log(it), client.end!]
