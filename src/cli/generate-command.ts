import axios from 'axios';
import {MockedFilms} from '../types/mocked-film.type';
import RandomFilmGenerator from '../utils/random-film-generator.js';
import {CliCommandInterface} from './cli-command.interface';
import FileWriter from '../common/file-writer.js';


export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private mockedFilms?: MockedFilms;

  public async execute(...parameters:string[]): Promise<void> {
    const count = parseInt(parameters[0], 10);
    const filepath = parameters[1];
    const url = parameters[2];

    try {
      const response = await axios.get(url);
      this.mockedFilms = response.data;
    } catch(err) {
      throw Error(`Fetch data from ${url} is failed. Error: ${err}`);
    }
    if (!this.mockedFilms) {
      console.log('Fetched data is empty.');
      return;
    }
    console.log('Generate movie string...');
    const movieGenerator = new RandomFilmGenerator(this.mockedFilms);
    const fileWriter = new FileWriter(filepath);

    console.log('Write to file...');
    for (let i = 0; i < count; i++) {
      await fileWriter.write(movieGenerator.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}

