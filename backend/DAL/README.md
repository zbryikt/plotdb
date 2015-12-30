Driver Implementation Note
------------------------------

1. put in folder DAL/xxxx/, with two files:
  * driver.ls - connection to real datastore. following members required:
    * aux: {}
    * init: (config, cb) ->
    * get-user: (username, password, usepasswd, detail, newuser, callback) ->
    * session-store: -> do
      - get: (sid, cb) ->
      - set: (sid, session, cb) -> 
      - destroy: (sid, cb) ->

  * layer.ls  - connection between DAL and driver:
    * read: (prefix, key) -> promise (data) ->
    * write: (prefix, key, data) -> promise (data-updated-part) ->
    * delete: (prefix, key) ->  promise 
    * list: (prefix, field, values) -> promise (data-list) ->

2. DAL information
  * it provides following interface:
    * read: (prefix, id)
    * write: (prefix, id, data)
    * delete: (prefix, id)
    * list: (prefix, key, values)
  * usage:
    require! 'DAL/main': DAL
    myDAL = new DAL('my driver name')
    myDAL.write('myType', null, { ... })
