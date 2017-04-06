angular.module \plotDB
  ..directive \viscanvas, <[$compile plConfig]> ++ ($compile,plConfig) -> do
    restrict: \A
    scope: do
      model: \=ngModel
    link: (s,e,a,c) -> 
      s.model.canvas = do
        iframe: e.find('iframe').0
        window: e.find('iframe').0.contentWindow
      s.model.msg = -> s.model.canvas.window.postMessage it, "#{plConfig.urlschema}#{plConfig.domain}"

      s.model.colorblind = do
        value: \normal
        choices: <[normal protanopia protanomaly deuteranopia deuteranomaly tritanopia
          tritanomaly achromatopsia achromatomaly]>
        set: ->
          if !(it in @choices) => return
          @value = it
          e.0.style <<< "-webkit-filter": "url(\##it)", filter: "url(\##it)"

      s.model.dimension = do
        value: \default
        choices: <[default QVGA HVGA FullHD Thumb Custom 4K]>
        map: do
          default: [0,0]
          QVGA: [240, 320]
          HVGA: [320, 480]
          Thumb: [308, 229]
          FullHD: [1920,1080]
          "4K": [3840,2160]
        custom: width: 640, height: 480
        init: -> s.$watch 'model.dimension.custom', (~> @set!), true
        set: ->
          if !(it in @choices) => it = @value
          @value = it
          canvas = e.0.querySelector(".inner")
          {width,height} = e.0.getBoundingClientRect!{width, height}
          if @value == \default =>
            [w,h] = <[100% 100%]>
            canvas.style <<< marginTop: 0, marginLeft: 0
          else
            if @value == \Custom => [w,h] = [@custom.width, @custom.height]
            else [w,h] = @map[@value]
            canvas.style.marginTop  = "#{if height > h => (height - h)/2 else 0}px"
            canvas.style.marginLeft = "#{if width > w => (width - w)/2 else 0}px"
            v = {w,h}
            [w,h] = [w,h].map(->"#{it}px")
          canvas.style <<< width: w, height: h
          if v? =>
            if height < v.h => e.0.scrollTop = v.h/2
            if width < v.w => e.0.scrollLeft = v.w/2
      s.model.dimension.init!


  ..directive \codeeditor, <[$compile]> ++ ($compile) -> do
    restrict: \A
    scope: do
      model: \=ngModel
    link: (s,e,a,c) -> 
      editor = do
        cm: null
        theme: do
          value: \default
          choices: <[default neat monokai rubyblue colorforth]>
          set: ->
            editor.cm.setOption \theme, @value = it
            document.cookie = "code_editor_theme=#it"
        update: (content, type) ->
          editor.cm.getDoc!setValue content
          if type => editor.cm.setOption \mode, type
          editor.cm.focus!
        init: ->
          @cm = CodeMirror.fromTextArea e.0, {lineNumbers: true, mode: "javascript", theme: "default"}
          editor.theme.set((/code_editor_theme=([^;].+?)(;|$)/.exec(document.cookie) or <[0 default]>).1)
          @cm.on \change ~> s.model.change @cm.getValue!, @cm
        focus: -> if @cm => @cm.focus!
      s.model <<< editor{theme, update,focus}
      editor.init!

