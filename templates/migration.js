module.exports = (tableName) => `
exports.up = async (knex) => {
  await knex.schema.createTable('${tableName.toLowerCase()}s', (table) => {
      table.increments('id').primary()
      table.boolean('isDeleted').notNull().defaultTo(false)
      table.timestamp('deletedAt')
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('${tableName.toLowerCase()}s')
}
`