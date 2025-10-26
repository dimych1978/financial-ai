// patched-ace.js
require('reflect-metadata')

// Патч для исправления Windows путей
const path = require('path')
const { pathToFileURL } = require('url')

// Преобразуем Windows путь в file:// URL
const appRoot = pathToFileURL(__dirname).href

console.log('🚀 Starting Financial AI Consultant with file:// URL...')
console.log('📁 App root:', appRoot)

const { Ignitor } = require('@adonisjs/core')

const ignitor = new Ignitor(appRoot)

ignitor.ace()
  .handle(process.argv.slice(2))
  .then(() => {
    console.log('✅ Ace command completed')
  })
  .catch((error) => {
    console.error('❌ Failed to start ace:', error)
    process.exit(1)
  })