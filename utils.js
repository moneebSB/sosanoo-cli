const templates = require('./templates')

const fs = require('fs-extra')
const path = require('path')


// Utility: Generate file content based on template
const generateFile = async (filePath, template) => {
  fs.ensureFileSync(filePath)
  fs.writeFileSync(filePath, template)
  const chalk = (await import('chalk')).default
  console.log(chalk.green(`[√] File Created: ${filePath}`))
}


exports.generateModel = (name) => {
  const basePath = path.resolve(__dirname, '..')
  const modelPath = path.join(basePath, 'models', `${name[0].toUpperCase() + name.slice(1)}Model.js`)
  generateFile(modelPath, templates.ModelTemplate(name))
}

exports.generateDAO = (name) => {
  const basePath = path.resolve(__dirname, '..')
  const daoPath = path.join(basePath, 'database/dao', `${name[0].toUpperCase() + name.slice(1)}DAO.js`)
  generateFile(daoPath, templates.DAOTemlpate(name))
}

exports.generateHandler = (name, version, entity, type = 'all') => {
  const basePath = path.resolve(__dirname, '..')
  const versionPath = path.join(basePath, 'handlers', version, entity, name)

  Object.keys(templates.HandlerTemplate).forEach(handler => {
    if (type === 'all' || type === handler) {
      generateFile(path.join(versionPath, `${handler[0].toUpperCase() + handler.slice(1)}${name[0].toUpperCase() + name.slice(1)}Handler.js`), templates.HandlerTemplate[handler](name))
    }
  })
}

exports.generateController = (name, version, entity) => {
  const basePath = path.resolve(__dirname, '..')
  const controllerPath = path.join(basePath, 'controllers', version, entity, name[0].toUpperCase() + name.slice(1) + 'Controller.js')
  generateFile(controllerPath, templates.ControllerTemplate(name, entity, `${version}/${entity}/${name}`))
}

exports.generateMigration = (name) => {
  const basePath = path.resolve(__dirname, '..')
  const migrationPath = path.join(basePath, 'database/migrations', `create_${name.toLowerCase()}_table.js`)
  generateFile(migrationPath, templates.MigrationTemplate(name))
}