angular.module \plotDB
  ..directive \ngselect2, -> do
        require: <[]>
        restrict: \A
        scope: do
          model: \=ngModel
          istag: \@istag
        link: (s,e,a,c) ->
          changed = ->
            [cval,nval] = [s.model, $(e).val!]
            if !Array.isArray(cval) => return cval != nval
            [cval,nval] = [cval,nval].map -> (it or []).join(",")
            cval != nval
          config = {}
          if s.istag => config <<< tags: true, tokenSeparators: [',']
          $(e).select2!
          $(e).select2 config .on \change, ~>
            if changed! => setTimeout (-> s.$apply -> s.model = $(e)val!),0
          s.$watch 'model', (vals) ~>
            html = ""
            # escaped html from jquery.
            # jquery.val won't help select2 build option tags so we have to do this by ourselves
            if config.tags =>
              for val in (vals or []) => html += $("<option></option>").val(val).text(val).0.outerHTML
              $(e).html(html)
            if changed! => setTimeout (-> $(e).val(vals).trigger(\change) ),0

/*
      settings: do
        changed: (node, field) ->
          [cval,nval] = [$scope.chart[field], $(node)val!]
          if !Array.isArray(cval) => return cval != nval
          [cval,nval] = [cval,nval].map -> (it or []).join(",")
          cval != nval
        bind: (node, field, config = {}) ->
          $(node)select2!
          $(node).select2 config .on \change, ~>
            if @changed(node,field) => setTimeout (-> $scope.$apply -> $scope.chart[field] = $(node).val!),0
          $scope.$watch "chart.#field", (vals) ~>
            html = ""
            # escaped html from jquery.
            # jquery.val won't help select2 build option tags so we have to do this by ourselves
            if config.tags =>
              for val in (vals or []) => html += $("<option></option>").val(val).text(val).0.outerHTML
              $(node).html(html)
            if @changed(node,field) => $(node).val(vals).trigger(\change)
*/
