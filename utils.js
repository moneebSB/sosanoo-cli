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
      await fsAsync.access(packageJsonPath)
      return currentDir
    } catch (err) {

      const parentDir = path.dirname(currentDir)
      if (parentDir === currentDir) break
      currentDir = parentDir
    }
  }

  return null
}

const getTemplate = async (templateName) => {
  try {
    console.log("from custom", require(`${await findRootProjectPath(process.cwd())}/ignite/templates`)[templateName])
    return require(`${await findRootProjectPath(process.cwd())}/ignite/templates`)[templateName] || templates[templateName]
  } catch (err) {
    return templates[templateName]
  }
}

const generateFile = async (filePath, template, upsertIndex = true, isList = false) => {


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
    await updateIndexFile(path.dirname(absolutePath), path.basename(filePath, '.js'), isList)

}
const updateIndexFile = async (dirPath, moduleName, isList = false) => {
  const indexPath = path.join(dirPath, 'index.js')
  let newEntry = `  ${moduleName}: require('./${moduleName}')`
  if (isList) {
    newEntry = `  require('./${moduleName}')`
  }

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
  await generateFile(modelPath, (await getTemplate('ModelTemplate'))(name), false)
}

exports.generateDAO = async (name) => {
  const daoPath = `database/dao/${name[0].toUpperCase() + name.slice(1)}DAO.js`
  await generateFile(daoPath, (await getTemplate('DAOTemlpate'))(name), false)
}

exports.generateHandler = async (name, version, entity, type = 'all') => {
  const versionPath = `handlers/${version}/${entity}/${name}`
  for (const handler of Object.keys(await getTemplate('HandlerTemplate'))) {
    if (type === 'all' || type === handler)
      await generateFile(path.join(versionPath, `${handler[0].toUpperCase() + handler.slice(1)}${name[0].toUpperCase() + name.slice(1)}Handler.js`), (await getTemplate('HandlerTemplate'))[handler](name))
  }
}

exports.generateController = async (name, version, entity) => {
  const controllerPath = `controllers/${version}/${entity}/${name[0].toUpperCase() + name.slice(1)}Controller.js`
  await generateFile(controllerPath, (await getTemplate('ControllerTemplate'))(name, entity, `${version}/${entity}/${name}`), true, true)
}


function generateMigrationFilename(description) {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Get month in 2 digits
  const day = String(now.getDate()).padStart(2, '0') // Get day in 2 digits
  const hours = String(now.getHours()).padStart(2, '0') // Get hours in 2 digits
  const minutes = String(now.getMinutes()).padStart(2, '0') // Get minutes in 2 digits
  const seconds = String(now.getSeconds()).padStart(2, '0') // Get seconds in 2 digits

  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`

  return `${timestamp}_${description}.js`
}
exports.generateMigration = async (name) => {
  const migrationPath = `database/migrations/${generateMigrationFilename(`create_${name.toLowerCase()}_table`)}`
  await generateFile(migrationPath, (await getTemplate('MigrationTemplate'))(name), false)
}


exports.findRootProjectPath = findRootProjectPath