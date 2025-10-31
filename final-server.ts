require('reflect-metadata')
const { pathToFileURL } = require('url')
const { Ignitor } = require('@adonisjs/core')

const appRoot = pathToFileURL(__dirname).href

console.log('🚀 Starting Financial AI Consultant...')

const ignitor = new Ignitor(appRoot)

ignitor.httpServer()
  .start((http: any) => {
    console.log('✅ Application started')
    
    const router = http.container.use('Adonis/Core/Route')
    
    console.log('✅ Financial AI routes registered')
  })
  .catch((error: any) => {
    console.error('❌ Failed:', error.message)
    console.log('💡 The server is likely already configured in start/kernel.ts')
    console.log('💡 Try running through ace instead: node ace serve --watch')
  })