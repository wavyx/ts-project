import { Server } from './Server';
import config, { IConfig } from 'config';
import { Logger } from './helpers';

const log = Logger.create({ module: module.id });
const appConfig: IConfig = config.get('app');
const workerConfig: IConfig = config.get('worker');

// Catch all uncaught exception, log it and then die properly
process.on('uncaughtException', (err) => {
  log.error('UNCAUGHT_EXCEPTION', err);
  /* FIXME rabbitmq.close().then(() => {
    process.exit(1);
  });*/
});

const start = async () => {
  const server: Server = new Server();
  console.log(server.router);
  if (workerConfig.get('on')) {
    /* FIXME rabbitmq.init().then(() => {
      startWorker();
    });*/
  }

  server.app
    .listen(appConfig.get('port'), '0.0.0.0', () => {
      log.info('SERVER_STARTED_SUCCESS', appConfig);
    })
    .on('error', (err: Error) => {
      return log.error('SERVER_STARTED_FAIL', err);
    });
};

start();
