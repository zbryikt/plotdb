require! <[./base ./extend]>

ret = {type: {}} <<< base
ret.type <<< extend(base)

module.exports = ret
