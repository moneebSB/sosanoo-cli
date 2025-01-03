#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const utils = require('./utils')
const logger = require('./logger')
const semver = require('semver')
const pkg = require('./package.json')

async function checkForUpdates() {
  const npmRegistryUrl = `https://registry.npmjs.org/${pkg.name}`
  try {
    const response = await fetch(npmRegistryUrl)
    if (response.ok) {
      const data = await response.json()
      const latestVersion = data['dist-tags'].latest

      if (semver.lt(pkg.version, latestVersion)) {
        logger.warn(`Update available: ${latestVersion}`)
        logger.warn(`Current version: ${pkg.version}`)
        logger.warn(`Run \`npm update ${pkg.name}\` to update.\n`)
      }
    }
  } catch (error) {
    logger.error('Failed to check for updates:', error.message)
  }
}

program
  .name('Ignite-cli')
  .description('CLI to generate models, DAOs, handlers, controllers, and migrations')
  .version(pkg.version)
  .showHelpAfterError('Use --help for usage instructions!')
  .option('-t, --trace', 'display trace statements for commands')
  .hook('preAction', async (thisCommand, actionCommand) => {
    await checkForUpdates()
    if (thisCommand.opts().trace) {
      logger.info(`About to call action handler for subcommand: ${actionCommand.name()}`)
      logger.info('arguments: %O', actionCommand.args)
      logger.info('options: %o', actionCommand.opts())
    }
  }).configureOutput({
    writeOut: (str) => logger.info(str),
    writeErr: (str) => logger.error(str),
  })


program
  .command('g')
  .description('Generate scaffolds for models, DAOs, handlers, controllers, and migrations')
  .argument('[type]', 'Type of scaffold to generate (e.g., model, dao, handler, controller, migration, or all)')
  .requiredOption('-n, --name <name>', 'Name of the entity (e.g., AdvertisingNetwork)')
  .option('-v, --version <version>', 'API version (default: v1)', 'v1')
  .option('-e, --entity <entity>', 'Entity folder (default: app)', 'app')
  .action(async (type, options) => {
    const { name, version, entity } = options
    const generators = {
      model: () => utils.generateModel(name),
      dao: () => utils.generateDAO(name),
      handler: (type = 'all') => utils.generateHandler(name, version, entity, type),
      controller: () => utils.generateController(name, version, entity),
      migration: () => utils.generateMigration(name),
    }

    if (!type || type === 'all') {
      for (const [key, value] of Object.entries(generators)) {
        await value()
        logger.success(`[√] ${key.toUpperCase()} scaffolding completed.`)
      }

      logger.success('All scaffolding completed.')
    } else {
      for (const t of type.split(',')) {
        const [scaffold, type] = t.includes(':') ? [generators[t.split(':')[0]], t.split(':')[1]] : [generators[t.toLowerCase()], undefined]
        if (scaffold) {
          await scaffold(type)
          logger.success(`[√] ${t.toUpperCase()} scaffolding completed.`)
        } else {
          logger.fatal(`Unknown scaffold type: ${type}`)
        }
      }
    }
  })

program.parse(process.argv)
