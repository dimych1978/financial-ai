
module.exports = {
  providers: [
    () => require('@adonisjs/core/providers/app_provider'),
    () => require('@adonisjs/http-server/providers/http_server_provider'),
    () => require('@adonisjs/bodyparser/providers/bodyparser_provider')
  ],
  preloads: [
    () => require('./start/routes'),
    () => require('./start/kernel')
  ],
  commands: [
    './commands/start_server'
  ]
}
