module.exports = (name, entity, handlerPath) => `
const router = require('express').Router()
const handlers = require('handlers/${handlerPath}')
const { BaseController } = require('controllers/BaseController')

class ${name[0].toUpperCase() + name.slice(1)}Controller extends BaseController {
  get router() {
    router.get('/${name}s/:id', this.handlerRunner(handlers.Get${name[0].toUpperCase() + name.slice(1)}Handler))
    router.get('/${name}s', this.handlerRunner(handlers.List${name[0].toUpperCase() + name.slice(1)}Handler))
    router.post('/${name}s', this.handlerRunner(handlers.Create${name[0].toUpperCase() + name.slice(1)}Handler))
    router.put('/${name}s', this.handlerRunner(handlers.Update${name[0].toUpperCase() + name.slice(1)}Handler))
    router.delete('/${name}s', this.handlerRunner(handlers.Delete${name[0].toUpperCase() + name.slice(1)}Handler))
    return router
  }

  async init() {
    this.logger.debug('${entity.toUpperCase()} ${name[0].toUpperCase() + name.slice(1)}Controller initialized...')
  }
}

module.exports = ${name[0].toUpperCase() + name.slice(1)}Controller
`