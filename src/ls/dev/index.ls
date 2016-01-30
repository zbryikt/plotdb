angular.module \plotDB
  ..controller \test, <[$scope IOService]> ++ ($scope, IOService) ->
    $scope.io = IOService
    colorschema-inited = false
    custom = [{ name: "Custom", key: '0', colors: [{hex: \#999999}] }]
    defpal = [
        * name: 'Movie / Friday the 13th', key: '557aabfafb1727f10341787f', colors: <[#fefefe #cec9c9 #3c302e #bb171a]>
        * name: 'Abstract / Tropical', key: '557aabfafb1727f103417896', colors: <[#51cacc #9df871 #e0ff77 #de9dd6 #ff708e]>
        * name: 'Abstract / Tender', key: '557aabfafb1727f103417897', colors: <[#f29c98 #f5b697 #f5e797 #a2e4f5 #009dd3]>
        * name: 'Marvel / Captain America', key: '557aabfafb1727f10341788d', colors: <[#9b3430 #fefefe #aeb7c2 #3b5fa4 #171b31]>
        * name: 'Abstract / Desert', key: '557aabfafb1727f10341789f', colors: <[#706d5d #b4b197 #f4efcc #e2d07e #bfa65f]>
        * name: 'Disney / Frozen', key: '557aabfafb1727f10341784f', colors: <[#b5ccf1 #94a9ce #667395 #292664 #f5f4fa #f2bed1 #87434d #552b2f]>
        * name: 'Brand / Google', key: '557aabfafb1727f103417890', colors: <[#c5523f #f2b736 #499255 #1875e5]>
        * name: 'Painting / The Scream', key: '557aabfafb1727f10341789d', colors: <[#514134 #e35839 #d28d4f #dbae1d #477187 #323a3f]>
        * name: 'DreamWorks / Shrek - alt', key: '557aabfafb1727f10341785f', colors: <[#b3c430 #4c5630 #f7faf8 #80aaf3 #984f48 #539a55]>
    ]
    for item in defpal => item.colors = item.colors.map(->{hex: it})
    convert = -> it.map(->{id: it.key, text: it.name, data: it.colors})
    sel = [{ text: 'Custom', children: convert custom }]
    sel.push { text: 'Default', children: convert defpal }
    $scope.selector = sel
    console.log $scope.selector
    colorschema-inited = false
    console.log $(\#pal-select)
    setTimeout (->
      $(\#pal-select)
        ..select2 icon-pal-select-config = do
          allowedMethods: <[updateResults]>
          templateResult: (state) ->
            if !state.data => return state.text
            color = [("<div class='color' "+
              "style='background:#{c.hex};width:#{100/state.data.length}%'"+
              "></div>") for c in state.data
            ].join("")
            $("<div class='palette select'><div class='name'>#{state.text}</div>"+
              "<div class='palette-color'>#color</div></div>")
          data: $scope.selector
        ..on \change, (e) -> 
          $scope.schema-is-custom = ($(@)val! == \0)
          #if !$scope.demoLoader => return
          if !colorschema-inited => return colorschema-inited := true
          count = 0
          #pal = $scope.palettes.all.filter(~> it.key == $(@)val! ).0
          #$scope.build.cbk = pal.colors[count].hex
          /*
          count = ( count + 1 ) % pal.colors.length
          for v,idx in $scope.demoLoader.vars => 
            if v.type == \color =>
              $scope.build["c#{idx + 1}"] = pal.colors[count].hex
              count = ( count + 1 ) % pal.colors.length
            if v.type == \palette =>
              $scope.build["c#{idx + 1}"] = pal.colors.map -> it.hex
          $scope.colorpicker.ctrl.set-palette {colors: pal.colors}
          ga \send, \event, \icon-editor, \colorschema, pal.name
          */
    ), 0
    #$(\#pal-select)val \0 .trigger \change

