require! <[fs]>
data = JSON.parse(fs.read-file-sync \here .toString!)
data.objects.town.names = data.objects.town.geometries.map -> [it.properties.C_Name,it.properties.T_Name]
data.objects.county.names = data.objects.county.geometries.map -> it.properties.C_Name
fs.write-file-sync \out.js, JSON.stringify(data)
