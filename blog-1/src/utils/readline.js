const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.resolve(__dirname, '../../log', 'access.log')
const readStream = fs.createReadStream(fileName)

const rl = readline.createInterface({input: readStream})

let sum = 0
let chromeNum = 0
rl.on('line', (lineData) => {
  if (!lineData) return
  sum++

  const lineArr = lineData.split('--')
  if (lineArr[2].indexOf('Chrome') > -1) {
    chromeNum++
  }
})

rl.on('close', () => {
  console.log('chrome/sum =', chromeNum / sum * 100 + '%')
})
