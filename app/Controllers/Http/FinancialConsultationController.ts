// app/Controllers/Http/FinancialConsultationController.ts
const { HttpContextContract } = require('@ioc:Adonis/Core/HttpContext')

export default class FinancialConsultationController {
  public async consult({ request, response }: typeof HttpContextContract) {
    const { message } = request.only(['message'])
    
    if (!message) {
      return response.badRequest({ error: 'Message is required' })
    }

    const advice = this.getFinancialAdvice(message)
    
    return response.json({ 
      success: true,
      response: advice 
    })
  }

  private getFinancialAdvice(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('накопить')) {
      return 'Для накопления: определите цель, срок и ежемесячную сумму. Используйте накопительные счета под 5-7% годовых.'
    }
    
    if (lowerMessage.includes('инвест')) {
      return 'Для инвестиций: рассмотрите ОФЗ, ETF или ИИС с налоговыми вычетами.'
    }
    
    return `Консультация по вопросу: "${message}". Рекомендуем вести бюджет и создавать финансовую подушку.`
  }
}