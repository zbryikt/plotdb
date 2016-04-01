Dataset
============

Datasets in PlotDB can be divided into 4 categories:

* static dataset - data are saved statically.
* dynamic dataset - data are fetched from different sources by server.
* realtime dataset - data area fetched from different sources by client, periodically.

Currently we expect 2 types of data from each category:
* CSV ( data formatted in table style )
* JSON

payload data
  theme
  chart
  data
    datasets
      key, name, description, type, owner, permission (all fields)
      fields: ( if type == static or dynamic )
        key, dataset, name, data
