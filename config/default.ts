import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

module.exports = {
  app: {
    name: process.env.APP_NAME || 'ts-project',
    port: process.env.APP_PORT || 80,
    project: packageJson.name,
    version: packageJson.version,
    buildNumber: process.env.BUILD_NUMBER_CI || 'local',
    commit: process.env.BUILD_COMMIT || '',
    logLevel: process.env.LOG_LEVEL || 'debug',
    env: process.env.NODE_ENV || 'development',
  },
  worker: {
    on: process.env.WORKER_ON || false,
  },
};
