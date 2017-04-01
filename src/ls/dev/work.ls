
chart
  save, _save -> merge into one
  bind
  local.get
  update
    config
    data
    code ( set code by choice, set code mode ) 
build (codemirror -> chart -> reset )
loadSampleData
download

settingPanel
sharePanel

dataset
dataset.saved
dataset.changed




#domain = do # deprecated
#  com: ""
#  io: ""

#init = -> init.list.push it

# ui control
# communicate with dataset
#dispatcher = init do
#  handlers: {}
#  register: (name, handler) -> @handlers[][name].push(handler)
#  handle: (evt) -> 
#    list = @handlers[evt.data.type] or []
#    list.map -> it evt.data
#  init: -> window.addEventListener \message, dispatcher, false 

# Modal Jade Mixin
#+Dialog("model")
#  ( content ... )

# 負責處理 modal
#chartModal      # replace  panel -> chart-name
#  name          # 命名 modal

# 編輯器的設定
#editor = init do
#  theme: do
#    value: \default
#    choices: <[default neat monokai rubyblue colorforth]>
#    set: ->  
#      $scope.editor.setOption \theme, @value = it
#      document.cookie = "editortheme=#it"
#  size: 
#    value: ''  # empty or 'lg'
#    toggle: ->
#      # trigger resize // canvas-resize
#  cm: null
#  update: ->
#  init: ->
#    @cm.on \change ->   # build


#init.list.map -> it.init!

#obj
#  handler: -> @promise.res!
#  init: -> dispatcher.register \name, handler
#  action: -> new Promise

#chart = do
#  obj: do # load from server. parsed from string
##    dimension
#    config
#    code.content, style.content, doc.content, assets ?
#    permission, key, name, description, owner, ...

#library
#init ( load code from server )
#reset ( load code into frame )
#config-hash


#canvas = do
  #colorblind
#  resize
  #dimension     #rwdtest
#  iframe
#  window        #framewin
#  msg           #send-msg


#service (chartService) # deprecated


#update-config
#local
#_save
#save
#bind



#edfunc-set
#edfunc-toggle
#last-edcode
#edcode

#update-data
#update-code (set code by choice, set code mode )


#paledit
#coloredit


