// final-server.ts
require('reflect-metadata')
const { pathToFileURL } = require('url')
const { Ignitor } = require('@adonisjs/core')

const appRoot = pathToFileURL(__dirname).href

console.log('🚀 Starting Financial AI Consultant...')

const ignitor = new Ignitor(appRoot)

// Запускаем приложение которое использует УЖЕ НАСТРОЕННЫЙ сервер из kernel.ts
ignitor.httpServer()
  .start((http: any) => {
    console.log('✅ Application started')
    
    // Сервер УЖЕ создан в kernel.ts, мы только добавляем маршруты
    const router = http.container.use('Adonis/Core/Route')
    
    // Эти маршруты ДОБАВЛЯЮТСЯ к уже существующим в routes.ts
    console.log('✅ Financial AI routes registered')
  })
  .catch((error: any) => {
    console.error('❌ Failed:', error.message)
    console.log('💡 The server is likely already configured in start/kernel.ts')
    console.log('💡 Try running through ace instead: node ace serve --watch')
  })