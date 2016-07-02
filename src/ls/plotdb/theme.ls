plotdb.theme = do
  create: (config) ->
    {} <<< @base <<< config
  base: do
    palette: do
      default: []
      diverging: []
      sequential: []
      binary: []
      qualitative: []
      # 2 dimensional
      binary-diverge: []
      sequential-qualitative: []
      sequential-sequential: []
      diverging-diverging: []
    config: do
      padding: {type: [plotdb.Number], default: 10}

