import {CliCommandInterface} from './cli-command.interface.js';
import TsvFileReader from '../common/tsv-file-reader.js';
import chalk from 'chalk';
import {createFilm} from '../utils/film-constructor.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  async execute(filename: string): Promise<void> {
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', (line) => console.log((createFilm(line))));
    fileReader.on('end', (count) => console.log(`\n${count} строк прочитано.`));
    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        console.error(chalk.bgRed(chalk.black(`Catched an error: ${chalk.red(err.message)}`)));
      }
    }
  }
}
