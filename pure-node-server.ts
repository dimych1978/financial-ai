// pure-node-serverHttp.ts

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('reflect-metadata')
require('dotenv').config() // Загружаем .env

const http = require('http')
const url = require('url')

console.log('🚀 Starting Financial AI Consultant with GigaChat...')

// Проверяем наличие обязательных переменных
const requiredEnvVars = ['GIGACHAT_CLIENT_ID', 'GIGACHAT_CLIENT_SECRET']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars)
  console.log('💡 Please set them in your .env file')
  process.exit(1)
}

const serverHttp = http.createServer(async (req: any, res: any) => {
  const parsedUrl = url.parse(req.url, true)
  const { pathname } = parsedUrl
  
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }
  
  // Health check
  if (req.method === 'GET' && pathname === '/') {
    res.end(JSON.stringify({
      service: 'Financial AI Consultant with GigaChat',
      status: 'running',
      version: '2.0',
      framework: 'Node.js + TypeScript',
      features: ['GigaChat API Integration', 'Financial Consulting']
    }))
    return
  }
  
  // Financial consultation
  if (req.method === 'POST' && pathname === '/api/financial-consultation') {
    let body = ''
    
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body)
        
        if (!message) {
          res.statusCode = 400
          res.end(JSON.stringify({ 
            success: false,
            error: 'Message is required' 
          }))
          return
        }

        // Используем GigaChatService
        const GigaChatService = require('./app/Services/GigaChatService').default
        const service = new GigaChatService()
        const advice = await service.sendMessage(message)
        
        res.end(JSON.stringify({
          success: true,
          response: advice,
          timestamp: new Date().toISOString()
        }))
      } catch (error) {
        console.error('API Error:', error)
        res.statusCode = 500
        res.end(JSON.stringify({ 
          success: false,
          error: 'Service temporarily unavailable'
        }))
      }
    })
    return
  }
  
  // Not found
  res.statusCode = 404
  res.end(JSON.stringify({ 
    success: false,
    error: 'Not found' 
  }))
})

const PORT = process.env.PORT || 3333
serverHttp.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📊 GigaChat Financial Consultant ready!`)
  console.log(`🔑 Using GigaChat API`)
})