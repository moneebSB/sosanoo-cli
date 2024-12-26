const templates = require('./templates')

const fs = require('fs-extra')
const path = require('path')
const logger = require('./logger')
const fsAsync = require('fs').promises


/**
 * Recursively find the base path containing the nearest package.json from the current directory upwards.
 * @param {string} startDir - Directory to start searching from.
 * @returns {string|null} - The absolute path to the directory containing the nearest package.json, or null if not found.
 */
const findRootProjectPath = async (startDir) => {
  let currentDir = startDir

  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    try {
      await fsAsync.access(packageJsonPath) // Check if package.json exists
      return currentDir // Return the directory containing package.json
    } catch (err) {
      // If package.json doesn't exist, move up one directory
      const parentDir = path.dirname(currentDir)
      if (parentDir === currentDir) break // Reached the root directory
      currentDir = parentDir
    }
  }

  return null
}



const generateFile = async (filePath, template, upsertIndex = true) => {


  const basePath = await findRootProjectPath(process.cwd())
  if (!basePath) {
    logger.fatal('Could not find a package.json in any parent directory.')
  }

  const absolutePath = path.join(basePath, filePath)

  if (fs.existsSync(absolutePath)) {
    logger.error(`[!] File already exists at: ${absolutePath}`)
    return
  }

  fs.ensureFileSync(absolutePath)
  fs.writeFileSync(absolutePath, template)

  logger.success(`[√] File Created: ${absolutePath}`)
  if (upsertIndex)
    await updateIndexFile(path.dirname(absolutePath), path.basename(filePath, '.js'))

}
const updateIndexFile = async (dirPath, moduleName) => {
  const indexPath = path.join(dirPath, 'index.js')
  const newEntry = `  ${moduleName}: require('./${moduleName}')`

  if (!fs.existsSync(indexPath)) {
    const initialContent = `module.exports = {\n${newEntry}\n}\n`
    await fsAsync.writeFile(indexPath, initialContent)
    logger.success(`[√] File Created: ${indexPath}`)
  } else {
    // Append to the existing index.js
    const existingContent = await fsAsync.readFile(indexPath, 'utf8')

    if (existingContent.includes(newEntry)) {
      logger.info(`[~] File Skipped: Entry for '${moduleName}' already exists in ${indexPath}`)
      return
    }

    const updatedContent = existingContent.replace(
      /(\s*)(}|])\s*$/,
      `,\n${newEntry}$1$2`
    )

    await fsAsync.writeFile(indexPath, updatedContent)
    logger.success(`[√] File Updated: ${indexPath}`)
  }
}


exports.generateModel = async (name) => {
  const modelPath = `models/${name[0].toUpperCase() + name.slice(1)}Model.js`
  await generateFile(modelPath, templates.ModelTemplate(name), false)
}

exports.generateDAO = async (name) => {
  const daoPath = `database/dao/${name[0].toUpperCase() + name.slice(1)}DAO.js`
  await generateFile(daoPath, templates.DAOTemlpate(name), false)
}

exports.generateHandler = async (name, version, entity, type = 'all') => {
  const versionPath = `handlers/${version}/${entity}/${name}`
  for (const handler of Object.keys(templates.HandlerTemplate)) {
    await generateFile(path.join(versionPath, `${handler[0].toUpperCase() + handler.slice(1)}${name[0].toUpperCase() + name.slice(1)}Handler.js`), templates.HandlerTemplate[handler](name))
  }
}

exports.generateController = async (name, version, entity) => {
  const controllerPath = `controllers/${version}/${entity}/${name[0].toUpperCase() + name.slice(1)}Controller.js`
  await generateFile(controllerPath, templates.ControllerTemplate(name, entity, `${version}/${entity}/${name}`))
}

exports.generateMigration = async (name) => {
  const migrationPath = `database/migrations/create_${name.toLowerCase()}_table.js`
  await generateFile(migrationPath, templates.MigrationTemplate(name), false)
}