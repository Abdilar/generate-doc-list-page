require('dotenv').config();
const fs = require('fs')
const path = require('path');

const configDir = path.join(__dirname, 'src', 'config.js');

const configData = `
  export const BASE_API_URL = '${process.env.BASE_API_URL}';
  export const BUCKET_NAME = '${process.env.BUCKET_NAME}';
`
fs.writeFileSync(configDir, configData)