import config, { IConfig } from 'config';

const appConfig: IConfig = config.get('app');

export function read() {
  return {
    status: 'UP',
    name: appConfig.get('name'),
    project: appConfig.get('project'),
    version: appConfig.get('version'),
    buildNumber: appConfig.get('buildNumber'),
    commit: appConfig.get('commit'),
  };
}
