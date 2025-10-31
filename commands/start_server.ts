const BaseCommand = require('@adonisjs/core/ace')

interface RouteContext {
  request: {
    body: () => any
  }
  response: {
    status: (code: number) => {
      json: (data: any) => void
    }
    json: (data: any) => void
  }
}

export default class StartServer extends BaseCommand {
  public static commandName = 'start:server'
  public static description = 'Start Financial AI Server'

  public async run() {
    this.logger.info('🚀 Starting Financial AI Consultant Server...')

    const { Ignitor } = require('@adonisjs/core')
    const ignitor = new Ignitor(this.application.appRoot)

    // Инициализируем приложение
    await ignitor.application.init()
    await ignitor.application.boot()

    // Получаем роутер из контейнера
    const router = ignitor.application.container.use('Adonis/Core/Route')
    
    router.get('/', () => ({
      service: 'Financial AI Consultant',
      status: 'running',
      version: '1.0'
    }))
    
    router.post('/api/financial-consultation', async (ctx: RouteContext) => {
      const { message } = ctx.request.body()
      
      if (!message) {
        return ctx.response.status(400).json({ error: 'Message is required' })
      }

      const advice = this.getFinancialAdvice(message)
      return ctx.response.json({ 
        success: true,
        response: advice
      })
    })

    // Запускаем сервер
    await ignitor.httpServer().start()
    this.logger.success('✅ Server running on http://localhost:3333')
  }

  private getFinancialAdvice(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('накопить')) return 'Для накопления: определите цель и срок'
    if (lower.includes('инвест')) return 'Для инвестиций: рассмотрите ОФЗ и ETF'
    return `Консультация по: "${message}". Ведите бюджет.`
  }
}