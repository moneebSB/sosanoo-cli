module.exports = (name) => `
const joi = require('joi')
const { BaseModel, Rule } = require('backend-core')

const schema = {
  id: new Rule({
    validator: (v) => joi.number().integer().positive().validate(v).error || true,
    description: 'number integer positive',
  }),
  name: new Rule({
    validator: (v) => joi.string().min(3).max(200).validate(v).error || true,
    description: 'string min 3 max 200',
  }),
  isActive: new Rule({
    validator: (v) => joi.boolean().validate(v).error || true,
    description: 'boolean',
  }),
}

class ${name[0].toUpperCase() + name.slice(1)}Model extends BaseModel {
  static get schema() {
    return schema
  }
}

module.exports = ${name[0].toUpperCase() + name.slice(1)}Model
`