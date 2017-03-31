angular.module \plotDB
  ..service \sampleData, <[$rootScope]> ++ ($rootScope) ->
    ret = []
    ret.push do
      name: "Crimean War 1854", rows: 24, owneravatar: \sample, is-sample: true,
      key: "/dataset/sample/:crimeawar"
      _type: location: \sample,
      fields: [v for k,v of plotdb.data.sample.crimean-war]
    ret.push do
      name: "Life Expectancy (1985,2000,2015)", rows: 188, owneravatar: \sample, is-sample: true,
      key: "/dataset/sample/:life-expectancy"
      _type: location: \sample,
      fields: [v for k,v of plotdb.data.sample.life-expectancy]
    return ret
