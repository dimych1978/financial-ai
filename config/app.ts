const { defineConfig } = require('@adonisjs/core/http')

module.exports = defineConfig({
  secret: process.env.APP_KEY || 'super-secret-key-for-development',
  http: {
    allowMethodSpoofing: false,
    trustProxy: () => true,
    generateRequestId: false,
  },
})