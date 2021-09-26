const fs = require('fs')

const content = `
  var a = 1
  var b = a
  var c = a + b
`

fs.writeFile('/Users/wmmqy/Desktop/1.js', content, err => {
  if (err) {
    throw new Error(err)
  }

  console.log('写入成功')
})
