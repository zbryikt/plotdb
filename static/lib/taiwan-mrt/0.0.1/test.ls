require! <[fs]>
list = JSON.parse(fs.read-file-sync \blah .toString!)
hash = {}
link = []
for i from 0 til list.length =>
  item = list[i]
  hash[item.name] = item
  item.id = i
for item in list =>
  des = item.destination.split \,
  for d in des => link.push {source: item.id, target: hash[d].id}
for item in list => delete item.destination
fs.write-file-sync \output, JSON.stringify({nodes: list, links: link})
