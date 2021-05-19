// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/baseController';
import ExportConfig from '../../../app/controller/config';
import ExportGoods from '../../../app/controller/goods';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    config: ExportConfig;
    goods: ExportGoods;
    user: ExportUser;
  }
}
