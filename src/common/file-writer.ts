import {createWriteStream, WriteStream} from 'fs';

const KB64 = 2 ** 16;

export default class FileWriter {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: KB64,
      autoClose: true,
    });
  }

  async write(row: string): Promise<void> {
    return this.stream.write(`${row}\n`) ?
      Promise.resolve() :
      new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
  }
}
