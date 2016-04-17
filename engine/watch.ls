require! <[fs path chokidar child_process jade stylus require-reload]>
require! 'uglify-js': uglify-js, LiveScript: lsc, 'uglifycss': uglify-css
reload = require-reload require

RegExp.escape = -> it.replace /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"

cwd = path.resolve process.cwd!
cwd-re = new RegExp RegExp.escape "#cwd#{if cwd[* - 1]=='/' => "" else \/}"
log = (error, stdout, stderr) -> if "#{stdout}\n#{stderr}".trim! => console.log that

newer = (f1, f2) ->
  if !fs.exists-sync(f1) => return false
  if !fs.exists-sync(f2) => return true
  (fs.stat-sync(f1).mtime - fs.stat-sync(f2).mtime) > 0

mkdir-recurse = ->
  if !fs.exists-sync(it) =>
    mkdir-recurse path.dirname it
    fs.mkdir-sync it

src-tree = (matcher, morpher) ->
  ret = {} <<< do
    down-hash: {}
    up-hash: {}
    matcher: -> false
    morpher: -> it
    parse: (filename) ->
      dir = path.dirname(filename)
      ret = fs.read-file-sync filename .toString!split \\n .map @matcher .filter(->it)
      if @morpher => ret = ret.map ~> path.join(dir, @morpher(it, dir))
      else ret = ret.map -> path.join(dir, it)
      @down-hash[filename] = ret
      for it in ret => if not (filename in @up-hash.[][it]) => @up-hash.[][it].push filename
    find-root: (filename) ->
      work = [filename]
      ret = []
      hash = {}
      while work.length > 0
        f = work.pop!
        if !hash[f] and @up-hash.[][f].length == 0 =>
          hash[f] = 1
          ret.push f
        else work ++= @up-hash[f]
      ret
  ret <<< {matcher, morpher}

jade-tree = src-tree(
  (-> if /^ *include (.+)| *extends (.+)/.exec(it) => (that.1 or that.2) else null),
  ((it, dir) ->
    if /^\//.exec it => it = path.join(('../' * dir.split(/src\/jade\//)[* - 1].split(\/).length),it)
    it.replace(/(.jade)?$/, ".jade")
  )
)

styl-tree = src-tree(
  (-> if /^ *@import ('?)(.+)\1/.exec(it) => that.2 else null ),
  (-> it.replace(/(.styl)?$/, ".styl"))
)

ftype = ->
  switch
  | /\.ls$/.exec it => "ls"
  | /\.styl/.exec it => "styl"
  | /\.jade$/.exec it => "jade"
  | otherwise => "other"

filecache = {}
base = do
  ignore-list: [/^(.+\/)*?\.[^/]+$/]
  ignore-func: (f) -> @ignore-list.filter(-> it.exec f.replace(cwd-re, "")replace(/^\.\/+/, ""))length
  start: (config) ->
    @config = config
    <[src src/ls src/styl static static/css static/js]>.map ->
      if !fs.exists-sync it => fs.mkdir-sync it
    watcher = chokidar.watch 'src', ignored: (~> @ignore-func it), persistent: true
      .on \add, ~> @watch-handler it
      .on \change, ~> @watch-handler it
  watch-handler: (d) ->
    setTimeout (~> @_watch-handler d), 500
  _watch-handler: ->
    if !it or /node_modules|\.swp$/.exec(it)=> return
    src = if it.0 != \/ => path.join(cwd,it) else it
    src = src.replace path.join(cwd,\/), ""
    [type,cmd,des] = [ftype(src), "",""]

    if type == \other => return

    if type == \jade =>
      data = reload "./share/config.ls"
      try
        jade-tree.parse src
        srcs = jade-tree.find-root src
      catch
        console.log "[BUILD] #src failed: "
        console.log e.message
      console.log "[BUILD] recursive from #src:"
      _src = src
      for src in srcs
        if !/src\/jade/.exec(src) => continue
        try
          des = src.replace(/src\/jade/, "static").replace(/\.jade/, ".html")
          if newer(des, _src) => continue
          desdir = path.dirname(des)
          if !fs.exists-sync(desdir) or !fs.stat-sync(desdir).is-directory! => mkdir-recurse desdir
          try
            fs.write-file-sync des, jade.render (fs.read-file-sync src .toString!),{filename: src, basedir: path.join(cwd,\src/jade/)} <<< data
            console.log "[BUILD]   #src --> #des"
          catch
            console.log "[BUILD]   #src failed: "
            console.log e.message

    if type == \ls =>
      if !/src\/ls/.exec(src) => return
      des = src.replace(\src/ls, \static/js).replace /\.ls$/, ".js"
      if newer(des, src) => return
      try
        mkdir-recurse path.dirname(des)
        fs.write-file-sync(
          des,
          (
            if @config.debug =>
              lsc.compile(fs.read-file-sync(src)toString!,{bare:true})
            else =>
              uglify-js.minify(lsc.compile(fs.read-file-sync(src)toString!,{bare:true}),{fromString:true}).code
          )
        )
        console.log "[BUILD] #src --> #des"
      catch
        console.log "[BUILD] #src failed: "
        console.log e.message
      return

    if type == \styl =>
      try
        styl-tree.parse src
        srcs = styl-tree.find-root src
      catch
        console.log "[BUILD] #src failed: "
        console.log e.message
      console.log "[BUILD] recursive from #src:"
      _src = src
      for src in srcs
        if !/src\/styl/.exec(src) => continue
        try
          des = src.replace(/src\/styl/, "static/css").replace(/\.styl$/, ".css")
          if newer(des, _src) => continue
          stylus fs.read-file-sync(src)toString!
            .set \filename, src
            .define 'index', (a, b) ->
              a = (a.string or a.val).split(' ')
              return new stylus.nodes.Unit(a.indexOf b.val)
            .render (e, css) ~>
              if e =>
                console.log "[BUILD]   #src failed: "
                console.log "  >>>", e.name
                console.log "  >>>", e.message
              else =>
                mkdir-recurse path.dirname(des)
                if !@config.debug => css = uglify-css.processString css, uglyComments: true
                fs.write-file-sync des, css
                console.log "[BUILD]   #src --> #des"
        catch
          console.log "[BUILD]   #src failed: "
          console.log e.message

  build: (cmd, des, dess) ->
    filecache[des] = null
    if dess.length => for dir in dess.map(->path.dirname it) =>
      if !fs.exists-sync dir => mkdir-recurse dir
    console.log "[BUILD] #cmd"
    child_process.exec cmd, log

module.exports = base
