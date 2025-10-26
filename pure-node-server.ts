// pure-node-server.ts
const http = require('http')
const url = require('url')

console.log('🚀 Starting Financial AI Consultant (Pure Node.js)...')

const serverHttp = http.createServer(async (req: any, res: any) => {
  const parsedUrl = url.parse(req.url, true)
  const { pathname } = parsedUrl
  
  res.setHeader('Content-Type', 'application/json')
  
  // Health check
  if (req.method === 'GET' && pathname === '/') {
    res.end(JSON.stringify({
      service: 'Financial AI Consultant',
      status: 'running',
      version: '1.0',
      framework: 'Node.js + TypeScript',
      endpoints: {
        consultation: 'POST /api/financial-consultation'
      }
    }))
    return
  }
  
  // Financial consultation
  if (req.method === 'POST' && pathname === '/api/financial-consultation') {
    let body = ''
    
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body)
        
        if (!message) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Message is required' }))
          return
        }
        
        const advice = getFinancialAdvice(message)
        res.end(JSON.stringify({
          success: true,
          response: advice,
          timestamp: new Date().toISOString()
        }))
      } catch (error) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }
  
  // Not found
  res.statusCode = 404
  res.end(JSON.stringify({ error: 'Not found' }))
})

function getFinancialAdvice(message: string): string {
  const lower = message.toLowerCase()
  
  if (lower.includes('накопить') || lower.includes('копить')) {
    return `Для накопления на "${message}":\n• Определите сумму и срок\n• Откладывайте 10-20% дохода\n• Используйте накопительный счет\n• Рассмотрите ИИС для вычетов`
  }
  
  if (lower.includes('инвест')) {
    return `Инвестиционные инструменты:\n• ОФЗ (гос. облигации) - низкий риск\n• ETF на индексы Мосбиржи\n• ИИС типа А (вычет 13%) или Б (освобождение от налогов)\n• Диверсификация портфеля`
  }
  
  if (lower.includes('кредит') || lower.includes('заем')) {
    return `Кредитная консультация:\n✓ Сравните предложения 3-5 банков\n✓ Нагрузка не более 40% от дохода\n✓ Внимательно изучите условия\n✓ Рассмотрите досрочное погашение`
  }
  
  return `Консультация по вопросу: "${message}"\n\nОбщие финансовые рекомендации:\n• Ведите учет доходов и расходов\n• Создайте финансовую подушку безопасности 3-6 месяцев\n• Диверсифицируйте источники дохода\n• Регулярно откладывайте на долгосрочные цели\n• Пользуйтесь налоговыми вычетами`
}

const PORT = 3333
serverHttp.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📊 Financial consultation API ready!`)
  console.log(`💡 Test with:`)
  console.log(`   curl http://localhost:${PORT}`)
  console.log(`   curl -X POST http://localhost:${PORT}/api/financial-consultation -H "Content-Type: application/json" -d '{"message":"Как накопить на машину?"}'`)
})