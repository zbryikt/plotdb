#!/usr/bin/env bash
while [ 1 ]; do
  tag=$(date +%Y-%m-%d-%H)
  gsutil -m cp workspace/production/server/static/s/avatar/* gs://plotdb-backup/production/$tag/avatar/
  gsutil -m cp workspace/production/server/static/s/chart/* gs://plotdb-backup/production/$tag/chart/
  pg_dump plotdb > ~/workspace/production/dbdump/plotdb-$tag-dump.sql
  gsutil cp ~/workspace/production/dbdump/plotdb-$tag-dump.sql gs://plotdb-backup/production/$tag/postgresql/
  sleep 86400
done
