const GigaChatService = require('#services/GigaChatService')

interface CustomContext {
  request: {
    only(fields: string[]): Record<string, any>
  }
  response: {
    badRequest(data: any): any
    json(data: any): any
    internalServerError(data: any): any
  }
  auth?: any
  params?: any
  session?: any
}

class FinancialConsultationController {
  async consult(ctx: CustomContext) {
    const { request, response } = ctx
    const { message, context } = request.only(['message', 'context'])
    
    if (!message) {
      return response.badRequest({ 
        success: false,
        error: 'Message is required' 
      })
    }

    try {
      const gigaChatService = new GigaChatService()
      const aiResponse = await gigaChatService.sendMessage(message, context)
      
      return response.json({ 
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Controller error:', error)
      
      return response.internalServerError({ 
        success: false,
        error: 'Financial consultation service is temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
}

module.exports = FinancialConsultationController