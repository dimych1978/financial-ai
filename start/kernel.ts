const server = require('@adonisjs/core/services/server')
const router = require('@adonisjs/core/services/router')

server.use([
  () => require('@adonisjs/core/bodyparser_middleware')
])

router.use([() => require('@adonisjs/core/bodyparser_middleware')])