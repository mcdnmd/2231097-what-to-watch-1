import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT : {
    doc: 'Port for incoming connections.',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_HOST:{
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Salt for password',
    format: String,
    env: 'SALT',
    default: null
  }
});
