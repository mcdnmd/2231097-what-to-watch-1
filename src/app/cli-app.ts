import {CliCommandInterface} from '../cli/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[]
}

export default class CliApp {
  private commands: {[propName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';

  private parseInputCommand(cliArgs: string[]) : ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArgs.reduce((acc, item) => {
      if (item.startsWith('--')){
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }
      return acc;
    }, parsedCommand);
  }

  public registerCommand(commandList: CliCommandInterface[]): void {
    commandList.reduce((acc, Command) => {
      const cliCmd = Command;
      acc[cliCmd.name] = cliCmd;
      return acc;
    }, this.commands);
  }

  private getCommand(commandName: string) : CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseInputCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
