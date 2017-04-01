angular.module \plotDB
  ..controller \plPaletteModal, <[$scope eventBus paletteService]> ++ ($scope,eventBus,paletteService) -> do
    $scope.paledit = do 
      convert: -> it.map(->{id: it.key or "#{Math.random!}", text: it.name, data: it.colors})
      ldcp: null, item: null
      paste: null
      callback: null
      init: ->
        @ldcp = new ldColorPicker null, {}, $('#palette-editor .editor .ldColorPicker').0
        @ldcp.on \change-palette, ~> setTimeout ( ~> $scope.$apply ~> @update! ), 0
        @sample = paletteService.sample
        @list = []
        $(\#pal-select)
          ..select2 do
            ajax: do
              url: \/d/palette
              dataType: \json
              delay: 250
              data: (params) -> {offset: (params.page or 0)* 20, limit: 20}
              processResults: (data, params) ~>
                params.page = params.page or 0
                if params.page == 0 => @list = data = @sample ++ data
                else @list = @list ++ data
                return {
                  results: data.map(->{id: it.key, text: it.name, data: it.colors})
                  pagination: { more: data.length >= 20}
                }
            allowedMethods: <[updateResults]>
            escapeMarkup: -> it
            minimumInputLength: 0
            templateSelection: -> return it.text + "<small class='grayed'> (" + it.id + ")</small>"
            templateResult: (state) ->
              if !state.data => return state.text
              color = [("<div class='color' "+
                "style='background:#{c.hex};width:#{100/state.data.length}%'"+
                "></div>") for c in state.data
              ].join("")
              $("<div class='palette select'><div class='name'>#{state.text}</div>"+
                "<div class='palette-color'>#color</div></div>")
              return "<div class='palette select'><div class='name'>#{state.text}</div>"+
                "<div class='palette-color'>#color</div></div>"

            ..on \select2:closing, (e) ~>
              key = $(e.target)val!
              ret = @list.filter(-> it.key ~= key).0

              $scope.$apply ~> @item.value = JSON.parse(JSON.stringify(ret))
              @ldcp.set-palette @item.value
          $scope.$watch 'paledit.paste', (d) ~>
            try
              result = JSON.parse(d)
              if Array.isArray(result) => @ldcp.set-palette {colors: result.map(->{hex: it})}
            catch e
              console.log e
              $scope.paledit.paste = ''

      update: -> if @item =>
        [src,des,pairing] = [@item.value, @ldcp.get-palette!, []]
        for i from 0 til des.colors.length =>
          d = des.colors[i]
          for j from 0 til src.colors.length =>
            s = src.colors[j]
            if s.hex != d.hex => continue
            pairing.push [s, d, Math.abs(i - j)]
        pairing.sort (a,b) -> a.2 - b.2
        for pair in pairing =>
          if pair.0.pair or pair.1.pair => continue
          pair.0.pair = pair.1
          pair.1.pair = pair.0
        unpair = [src.colors.filter(->!it.pair), des.colors.filter(->!it.pair)]
        for i from 0 til Math.min(unpair.0.length, unpair.1.length) => unpair.1[i].pair = unpair.0[i]
        src.colors = des.colors.map -> if it.pair => it.pair <<< {hex: it.hex} else it
        src.colors.forEach -> delete it.pair
        @paste = null
        if $scope.paledit.callback => that!
        #$scope.update-config $scope.chart.config
      toggled: false
      toggle: ->
        @toggled = !!!@toggled
        if !@toggled => @update!
      edit: (item, cb = null) ->
        @callback = cb
        @item = item
        @ldcp.set-palette item.value
        @toggled = true

    $scope.paledit.init!
    eventBus.listen \paledit.edit, (item, cb) -> $scope.paledit.edit item, cb

