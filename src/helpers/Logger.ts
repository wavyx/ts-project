import winston from 'winston';
import os from 'os';
import config, { IConfig } from 'config';

const appConfig: IConfig = config.get('app');

export default class Logger {
  public static customFormat = (): winston.Logform.Format => {
    const logFormat: winston.Logform.Format = winston.format.combine(
      winston.format.json(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
    );
    return logFormat;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static create(meta?: any, options?: any): winston.Logger {
    const logFormat = Logger.customFormat();

    const metaInfo = {
      hostname: os.hostname(),
      pid: process.pid,
      version: appConfig.get('version'),
      component: appConfig.get('name'),
      build: appConfig.get('buildNumber'),
    };
    // Overrid defaultMeta with provided meta (if any)
    Object.assign(metaInfo, meta);

    const logger = winston.createLogger({
      level: options?.logLevel || appConfig.get('logLevel'),
      exitOnError: false,
      format: logFormat,
      defaultMeta: metaInfo,
      transports: [
        new winston.transports.Console({
          format: logFormat,
          silent: appConfig.get('env') === 'test',
        }),
      ],
    });

    return logger;
  }
}
