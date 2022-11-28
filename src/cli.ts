import 'reflect-metadata';
import CliApp from './app/cli-app.js';
import HelpCommand from './cli/help-command.js';
import VersionCommand from './cli/version-command.js';
import ImportCommand from './cli/import-command.js';
import GenerateCommand from './cli/generate-command.js';

const cliManager = new CliApp();
cliManager.registerCommand([
  new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand
]);
cliManager.processCommand(process.argv);
