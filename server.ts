// // server.ts
// require('reflect-metadata')

// const { Server: HttpServer } = require('@adonisjs/core/http')

// console.log('🚀 Starting Financial AI Consultant...')

// // Полная конфигурация сервера с QS
// const httpServer = new HttpServer({
//   allowMethodSpoofing: false,
//   trustProxy: () => true,
//   generateRequestId: false,
//   useAsyncLocalStorage: false,
//   qs: {
//     parse: {
//       depth: 10,
//       parameterLimit: 1000,
//       allowPrototypes: true,
//       arrayLimit: 20,
//       parseArrays: true
//     },
//     stringify: {
//       encode: true,
//       encodeValuesOnly: false,
//       arrayFormat: 'indices' as const,
//       skipNulls: false
//     }
//   }
// })

// // Маршруты
// httpServer.router.get('/', () => {
//   return { 
//     service: 'Financial AI Consultant',
//     status: 'running',
//     version: '1.0',
//     endpoints: {
//       consultation: 'POST /api/financial-consultation'
//     }
//   }
// })

// httpServer.router.post('/api/financial-consultation', async ({ request, response }: any) => {
//   const { message } = request.body()
  
//   if (!message) {
//     return response.status(400).json({ error: 'Message is required' })
//   }

//   // Финансовые советы
//   const advice = getFinancialAdvice(message)
  
//   return response.json({ 
//     success: true,
//     response: advice 
//   })
// })

// function getFinancialAdvice(message: string): string {
//   const lower = message.toLowerCase()
  
//   if (lower.includes('накопить') || lower.includes('копить')) {
//     return `Для накопления на "${message}":\n1. Определите точную сумму и срок\n2. Разбейте на ежемесячные платежи\n3. Используйте накопительный счет под 5-7%\n4. Рассмотрите вклады с капитализацией`
//   }
  
//   if (lower.includes('инвест')) {
//     return `Инвестиционные рекомендации:\n• ОФЗ - минимальный риск\n• ETF на индексы Московской биржи\n• ИИС для налоговых вычетов\n• Диверсифицируйте портфель`
//   }
  
//   if (lower.includes('кредит')) {
//     return `По кредитам:\n✓ Сравните предложения 3-5 банков\n✓ Нагрузка не более 40% дохода\n✓ Изучите скрытые комиссии\n✓ Рассмотрите досрочное погашение`
//   }
  
//   return `Консультация по вопросу: "${message}"\n\nОбщие рекомендации:\n• Ведите учет доходов и расходов\n• Создайте финансовую подушку 3-6 месяцев\n• Планируйте долгосрочные финансовые цели\n• Пользуйтесь налоговыми вычетами`
// }

// // Запускаем сервер
// httpServer.start()
//   .then(() => {
//     console.log('✅ Server running on http://localhost:3333')
//     console.log('📊 Send POST requests to: http://localhost:3333/api/financial-consultation')
//   })
//   .catch((error: any) => {
//     console.error('❌ Failed to start server:', error)
//     process.exit(1)
//   })