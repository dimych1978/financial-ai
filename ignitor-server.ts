// // ignitor-server.ts
// require('reflect-metadata')

// const { Ignitor } = require('@adonisjs/core')

// console.log('🚀 Starting Financial AI Consultant via Ignitor...')

// const ignitor = new Ignitor(__dirname)

// // Используем httpServer() для правильной инициализации
// ignitor.httpServer()
//   .start((http: any) => {
//     // Получаем роутер после запуска сервера
//     const router = http.container.use('Adonis/Core/Route')
    
//     // Маршруты
//     router.get('/', () => {
//       return { 
//         service: 'Financial AI Consultant',
//         status: 'running', 
//         version: '1.0'
//       }
//     })
    
//     router.post('/api/financial-consultation', async ({ request, response }: any) => {
//       const { message } = request.body()
      
//       if (!message) {
//         return response.status(400).json({ error: 'Message is required' })
//       }

//       const advice = getFinancialAdvice(message)
//       return response.json({ success: true, response: advice })
//     })
    
//     console.log('✅ Server running on http://localhost:3333')
//   })
//   .catch(console.error)

// function getFinancialAdvice(message: string): string {
//   const lower = message.toLowerCase()
//   if (lower.includes('накопить')) return 'Для накопления: определите цель и срок'
//   if (lower.includes('инвест')) return 'Для инвестиций: рассмотрите ОФЗ и ETF'
//   return `Консультация по: "${message}". Ведите бюджет.`
// }