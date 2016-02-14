angular.module \plotDB
  ..service \samplePalette, <[$rootScope]> ++ ($rootScope) ->
    ret = [
      * name: "Default", key: "F", colors: <[#1d3263 #226c87 #f8d672 #e48e11 #e03215 #ab2321]>
      * name: "Code for Africa", key: "A", colors: <[#f4502a #f1c227 #008a6d #00acdb #0064a8]>
      * name: "Chart", key: "B", colors: <[#3a66cb #0ebeba #fee476 #feae01 #e62b0f]>
      * name: "PlotDB", key: "C", colors: <[#ed1d78 #c59b6d #8cc63f #28aae2]>
      * name: "The Reporter", key: "D", colors: <[#7a322a #d52c2a #f93634 #dddb83 #ede6de #fdfffa #dbdbdb #48462d]>
      * name: "Pinky", key: "E", colors: <[#F29C98 #F5B697 #F5E797 #A2E4F5 #009DD3]>
    ]
    for item in ret => item.colors = item.colors.map -> {hex: it}
    ret
