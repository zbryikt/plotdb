require! <[fs markdown jsdom]>
markdown = markdown.markdown
ret =  markdown.toHTML(fs.read-file-sync \index.md .toString!)
jsdom.env ret, (e,w) ->
  node = w.document.querySelectorAll("h1,h2,h3,h4")
  output = ['ul#affix.nav.hidden-xs.hidden-sm(data-spy="affix")']
  count = 0
  for i from 0 til node.length
    nodeName = node[i].nodeName.toLowerCase!
    content = node[i].innerHTML
    id = content.replace(/ /g, '-').replace(/\(.*$/g, '').toLowerCase!
    if <[h1 h2]>.indexOf(nodeName)>=0 =>
      output.push '  li'
      output.push """  a(href="\##id") #content &\#xbb;"""
      count = 0
    else if nodeName == \h3 =>
      if !count => output.push '  ul.nav.subnav'
      output.push """    li: a(href="\##id") #content"""
      count += 1
  result = output.join('\n')

