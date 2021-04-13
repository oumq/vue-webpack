const chalk = require('chalk')
const glob = require('glob')

const moduleList = []
const moduleSrcArray = glob.sync('./src/modules/*')
for (let i = 0, len = moduleSrcArray.length; i < len; i++) {
  moduleList.push(moduleSrcArray[i].split('/')[3])
}

exports.moduleList = moduleList
