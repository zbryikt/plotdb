angular.module \plotDB
  ..service \sampleTheme, <[$rootScope]> ++ ($rootScope) ->
    [
      {
        key: "/theme/sample/:default"
        name: "Default"
        type: location: \sample, name: \theme
        style: content: """
        circle { fill: \#f00; stroke: #000; stroke-width: 2; }
        """
      },
      {
        key: "/theme/sample/:playfair"
        name: "Playfair"
        type: location: \sample, name: \theme
      }
    ]

