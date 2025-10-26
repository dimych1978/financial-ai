// commands/start_server.ts
const BaseCommand = require( '@adonisjs/core/ace')

export default class StartServer extends BaseCommand {
  public static commandName = 'start:server'
  public static description = 'Start Financial AI Server'

  public async run() {
    this.logger.info('🚀 Starting Financial AI Consultant Server...')

    const { Ignitor } = await import('@adonisjs/core')
    const ignitor = new Ignitor(this.application.appRoot)

    await ignitor.httpServer()
      .start((http: any) => {
        const router = http.container.use('Adonis/Core/Route')
        
        router.get('/', () => ({
          service: 'Financial AI Consultant',
          status: 'running',
          version: '1.0'
        }))
        
        router.post('/api/financial-consultation', async ({ request, response }: any) => {
          const { message } = request.body()
          
          if (!message) {
            return response.status(400).json({ error: 'Message is required' })
          }

          const advice = this.getFinancialAdvice(message)
          return response.json({ 
            success: true,
            response: advice
          })
        })
        
        this.logger.success('✅ Server running on http://localhost:3333')
      })
  }

  private getFinancialAdvice(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('накопить')) return 'Для накопления: определите цель и срок'
    if (lower.includes('инвест')) return 'Для инвестиций: рассмотрите ОФЗ и ETF'
    return `Консультация по: "${message}". Ведите бюджет.`
  }
}