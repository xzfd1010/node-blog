const fs = require('fs')
const path = require('path')

function writeLog (writeStream, log) {
  writeStream.write(log + '\n')
}

function createWriteStream (fileName) {
  const fullFileName = path.resolve(__dirname, '../../log', fileName)
  return fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
}

function access (log) {
  // console.log('log',log)
  const accessWriteStream = createWriteStream('access.log')
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}
