// start/routes.ts
const Route = require('@ioc:Adonis/Core/Route').default

Route.get('/', async () => {
  return { 
    service: 'Financial AI Consultant',
    status: 'running',
    version: '1.0'
  }
})

Route.post('/api/financial-consultation', 'FinancialConsultationController.consult')