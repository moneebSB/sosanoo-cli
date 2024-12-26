#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const utils = require('./utils')
const logger = require('./logger')


program
  .name('Ignite-cli')
  .description('CLI to generate models, DAOs, handlers, controllers, and migrations')
  .version('1.0.0')
  .showHelpAfterError('Use --help for usage instructions!')
  .option('-t, --trace', 'display trace statements for commands')
  .hook('preAction', (thisCommand, actionCommand) => {
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
      handler: () => utils.generateHandler(name, version, entity),
      controller: () => utils.generateController(name, version, entity),
      migration: () => utils.generateMigration(name),
    }

    if (!type || type === 'all') {
      for (const [key , value] of Object.entries(generators)) {
        await value()
        logger.success(`[√] ${key.toUpperCase()} scaffolding completed.`)
      }

      logger.success('All scaffolding completed.')
    } else {
      for (const t of type.split(',')) {
        const scaffold = generators[t.toLowerCase()]
        if (scaffold) {
          await scaffold()
          logger.success(`[√] ${t.toUpperCase()} scaffolding completed.`)
        } else {
          logger.fatal(`Unknown scaffold type: ${type}`)
        }
      }
    }
  })

program.parse(process.argv)
