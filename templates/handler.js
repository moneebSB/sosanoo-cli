exports.create = (name) => `
const { RequestRule } = require('backend-core')
const BaseHandler = require('handlers/BaseHandler')
const ${name[0].toUpperCase() + name.slice(1)}DAO = require('database/dao/${name[0].toUpperCase() + name.slice(1)}DAO')
const ${name[0].toUpperCase() + name.slice(1)}Model = require('models/${name[0].toUpperCase() + name.slice(1)}Model')

class Create${name[0].toUpperCase() + name.slice(1)}Handler extends BaseHandler {
  static get accessTag() {
    return '${name.toLowerCase()}:create'
  }

  static get validationRules() {
    return {
      body: {
        example: new RequestRule(${name[0].toUpperCase() + name.slice(1)}Model.schema.example, { required: true }),
      },
    }
  }

  static async run(ctx) {
    return this.result({ data: await ${name[0].toUpperCase() + name.slice(1)}DAO.baseCreate(ctx.body) })
  }
}

module.exports = Create${name[0].toUpperCase() + name.slice(1)}Handler
`

exports.update = (name) => `
const { RequestRule } = require('backend-core')
const BaseHandler = require('handlers/BaseHandler')
const ${name[0].toUpperCase() + name.slice(1)}DAO = require('database/dao/${name[0].toUpperCase() + name.slice(1)}DAO')
const ${name[0].toUpperCase() + name.slice(1)}Model = require('models/${name[0].toUpperCase() + name.slice(1)}Model')

class Update${name[0].toUpperCase() + name.slice(1)}Handler extends BaseHandler {
  static get accessTag() {
    return '${name.toLowerCase()}:update'
  }

  static get validationRules() {
    return {
      body: {
        example: new RequestRule(${name[0].toUpperCase() + name.slice(1)}Model.schema.example),
      },
    }
  }

  static async run(ctx) {
    return this.result({ data: await ${name[0].toUpperCase() + name.slice(1)}DAO.baseUpdate(ctx.body) })
  }
}

module.exports = Update${name[0].toUpperCase() + name.slice(1)}Handler
`

exports.get = (name) => `
const { RequestRule } = require('backend-core')
const BaseHandler = require('handlers/BaseHandler')
const ${name[0].toUpperCase() + name.slice(1)}DAO = require('database/dao/${name[0].toUpperCase() + name.slice(1)}DAO')
const ${name[0].toUpperCase() + name.slice(1)}Model = require('models/${name[0].toUpperCase() + name.slice(1)}Model')

class Get${name[0].toUpperCase() + name.slice(1)}Handler extends BaseHandler {
  static get accessTag() {
    return '${name.toLowerCase()}:get'
  }

  static get validationRules() {
    return {
      params: {
        id: new RequestRule(${name[0].toUpperCase() + name.slice(1)}Model.schema.id),
      },
    }
  }

  static async run(ctx) {
    return this.result({ data: await ${name[0].toUpperCase() + name.slice(1)}DAO.baseGetById(ctx.params.id) })
  }
} 

module.exports = Get${name[0].toUpperCase() + name.slice(1)}Handler
`

exports.list = (name) => `
const { RequestRule } = require('backend-core')
const BaseHandler = require('handlers/BaseHandler')
const ${name[0].toUpperCase() + name.slice(1)}DAO = require('database/dao/${name[0].toUpperCase() + name.slice(1)}DAO')
const ${name[0].toUpperCase() + name.slice(1)}Model = require('models/${name[0].toUpperCase() + name.slice(1)}Model')

class List${name[0].toUpperCase() + name.slice(1)}Handler extends BaseHandler {
  static get accessTag() {
    return '${name.toLowerCase()}:list'
  }

  static get validationRules() {
    return {
      ...this.baseQueryParams
    }
  }

  static async run(ctx) {
    return this.result({ data: await ${name[0].toUpperCase() + name.slice(1)}DAO.baseGetList(ctx.query) })
  }
}

module.exports = List${name[0].toUpperCase() + name.slice(1)}Handler
`

exports.delete = (name) => `
const { RequestRule } = require('backend-core')
const BaseHandler = require('handlers/BaseHandler')
const ${name[0].toUpperCase() + name.slice(1)}DAO = require('database/dao/${name[0].toUpperCase() + name.slice(1)}DAO')
const ${name[0].toUpperCase() + name.slice(1)}Model = require('models/${name[0].toUpperCase() + name.slice(1)}Model')

class Delete${name[0].toUpperCase() + name.slice(1)}Handler extends BaseHandler {
  static get accessTag() {
    return '${name.toLowerCase()}:delete'
  }

  static get validationRules() {
    return {
      params: {
        id: new RequestRule(${name[0].toUpperCase() + name.slice(1)}Model.schema.id),
      },
    }
  }

  static async run(ctx) {
    return this.result({ data: await ${name[0].toUpperCase() + name.slice(1)}DAO.baseDeleteById(ctx.params.id) })
  }
}

module.exports = Delete${name[0].toUpperCase() + name.slice(1)}Handler
`