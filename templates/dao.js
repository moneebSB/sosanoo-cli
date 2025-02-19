module.exports = (name) => `
const { BaseDAO } = require('backend-core')

class ${name[0].toUpperCase() + name.slice(1)}DAO extends BaseDAO {
  static get tableName() {
    return '${name.toLowerCase()}s'
  }

  static get relationMappings() {
    return {
    }
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson(json) {
    json = super.$formatJson(json)
    delete json.createdAt
    delete json.updatedAt
    delete json.isDeleted
    delete json.deletedAt

    return json
  }

}

module.exports = ${name[0].toUpperCase() + name.slice(1)}DAO
`