import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import path = require('path');

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620102797871_1359';

  // add your egg config in here
  config.middleware = [
    // 'request',
  ];

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'],
  };

  config.cors = {
    credentials: true,
    origin: ctx => ctx.get('origin'),
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/test',
    options: {
    },
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  const userConfig = {
    static: {
      prefix: '/',
      dir: path.join(appInfo.baseDir, 'app/public')
    },
    uploadDir: 'app/public/upload',
    multipart: {
      /** 文件接收配置 */
      mode: 'file',
      cleanSchedule: {
        cron: '0 0 4 * * *',
      },
      fileSize: '100mb',
      /** 文件接收配置 */
    }
  }
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
    ...userConfig,
  };
};
