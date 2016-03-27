#basic schema
# (error, code, [params])
# (true / false), hash here, details for parsing function here 
# if failed => return [true, 414, [ 9527 ]]

module.exports = do
  404: 'file not found'
  414: (len) -> "your file size ( #len ) is too long. "
