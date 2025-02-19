module.exports = (name) => `
const joi = require('joi')
const { BaseModel, Rule } = require('backend-core')

const schema = {
  id: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number integer positive'
  }),
  name: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.string().min(2).max(200))
      } catch (e) { return e.message }
      return true
    },
    description: 'string; min 2; max 200;'
  }),

 isActive: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.boolean())
      } catch (e) { return e.message }
      return true
    },
    description: 'boolean'
  }),

   array: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.array().items(joi.number().integer().positive()))
      } catch (e) { return e.message }
      return true
    },
    description: 'number;'
  }),

  object: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.object())
      } catch (e) { return e.message }
      return true
    },
    description: 'object;'
  }),
}

class ${name[0].toUpperCase() + name.slice(1)}Model extends BaseModel {
  static get schema() {
    return schema
  }
}

module.exports = ${name[0].toUpperCase() + name.slice(1)}Model
`