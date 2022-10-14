import {CliCommandInterface} from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public name = '--help';

  public async execute() {
    console.log(`
    Программа для подготовки данных для REST API сервера.

    Пример: cli.js --<command> [--arguments]

    Команды:
        --version:                   # выводит номер версии
        --help:                      # печатает этот текст
        --import <path>:             # импортирует данные из TSV
        --generate <n> <path> <url>    # Генерирует произвольное количество тестовых данных
    `);
  }
}
