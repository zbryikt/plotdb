
perm-handler = do
  type: <[none list read comment fork write admin]>
  fork-idx: 4 # fork
  is-fullfilled: ->
  caltype: (req, perm, owner, type) -> 
   val = @calc req, perm, owner
   val = if val < @type.indexOf(type) => 0 else val
   return [val,@type[val]]
  test: (req, perm, owner, type) -> @calc(req, perm, owner) >= @type.indexOf(type)
  calc: (req, perm, owner) ->
    maxlv = -> Math.max.apply null, it.map(->it._idx)
    [user,token,teams] = [(req.user or null), (req.{}query.token or null),(req.{}user.teams or null)]
    if user and +owner and user.key == +owner => return @type.indexOf(\admin)
    if !perm or !perm.[]list.length => return @fork-idx
    max = 0
    perm.list.map(~>
      it._idx = @type.indexOf(it.perm)
      val = if it.type == \global => it._idx
      else if it.type == \user and user and user.key == +it.target => it._idx
      else if it.type == \token and token == it.target => it._idx
      else if it.type == \team and teams and teams.indexOf(+it.target)>=0 => it._idx
      else 0
      if max < val => max := val
    )
    return max

# TEST CASE
perm-testcase = do
  correctness: ->
    console.log("EXPECT: 0 /", perm-handler.get-perm-value({}, perm))
    console.log("EXPECT: 0 /", perm-handler.get-perm-value({user: key: 6}, perm))
    console.log("EXPECT: 5 /", perm-handler.get-perm-value({user: key: 7}, perm))
    console.log("EXPECT: 3 /", perm-handler.get-perm-value({user: key: 1, teams: [29,30,31]}, perm))
    console.log("EXPECT: 0 /", perm-handler.get-perm-value({user: key: 2, teams: [30,31,32]}, perm))
    console.log("EXPECT: 4 /", perm-handler.get-perm-value({query: token: "60t6d3voso"}, perm))
    console.log("EXPECT: 5 /", perm-handler.get-perm-value({user:{key: 7}, query: token: "60t6d3voso"}, perm))
  running-time: ->
    t1 = new Date!getTime!
    for i from 0 til 100000
      perm-handler.get-perm-value({user: {key: 6, teams: [29,30,31,32,33,34]},query: token: "60t6d3voso"}, perm)
    t2 = new Date!getTime!
    console.log t2 - t1

module.exports = perm-handler
