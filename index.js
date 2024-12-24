#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const utils = require('./utils')


program
  .name('scaffold-cli')
  .description('CLI to generate models, DAOs, handlers, controllers, and migrations')
  .version('1.0.0')


program
  .command('g')
  .description('Generate scaffolds for models, DAOs, handlers, controllers, and migrations')
  .argument('[type]', 'Type of scaffold to generate (e.g., model, dao, handler, controller, migration, or all)')
  .requiredOption('-n, --name <name>', 'Name of the entity (e.g., AdvertisingNetwork)')
  .option('-v, --version <version>', 'API version (default: v1)', 'v1')
  .option('-e, --entity <entity>', 'Entity folder (default: app)', 'app')
  .action(async (type, options) => {
    const { name, version, entity } = options
    const chalk = (await import('chalk')).default
    // Define what to generate based on the type
    const generators = {
      model: () => utils.generateModel(name),
      dao: () => utils.generateDAO(name),
      handler: () => utils.generateHandler(name, version, entity),
      controller: () => utils.generateController(name, version, entity),
      migration: () => utils.generateMigration(name),
    }

    if (!type || type === 'all') {
      Object.values(generators).forEach((gen) => gen())
      console.log('All scaffolding completed.')
    } else if (generators[type]) {
      generators[type]()
      console.log(chalk.green(`[√] ${type} scaffolding completed.`))

    } else {
      console.error(chalk.red(`Unknown scaffold type: ${type}`))
      process.exit(1)
    }
  }).showHelpAfterError('Use --help for usage instructions!')

program.parse(process.argv)
