const fs = require('fs');
const path = require("path");

const sourceDir = path.join(__dirname, ".", 'doc-version-list.json');
const file = fs.readFileSync(sourceDir).toString().split('\n')
const regexp = new RegExp(/\d+[.]\d+[.]\d+([-]\d+)/)
const docList = file.filter((item) => regexp.test(item)).map(item => {
  const pattern = /^.*(\d+\.\d+\.\d+(-(\d+|alpha\.\d+))?).*$/;
  return item.replace(pattern, '$1')
})
const targetDir = path.join(__dirname, 'src', 'data.json')
fs.writeFileSync(targetDir, JSON.stringify(docList))