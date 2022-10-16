import {ConfigInterface} from './config.interface.js';
import {config} from 'dotenv';
import {configSchema, ConfigSchema} from './config.schema.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private readonly config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;
    const parsedOutput = config();
    if (parsedOutput.error){
      throw new Error('File .env doesn\'t exists in ROOT directory.');
    }
    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});
    this.config = configSchema.getProperties();

    this.logger.info('.env file parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
