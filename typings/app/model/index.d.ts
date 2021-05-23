// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGoods from '../../../app/model/goods';
import ExportMessages from '../../../app/model/messages';
import ExportRecords from '../../../app/model/records';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Goods: ReturnType<typeof ExportGoods>;
    Messages: ReturnType<typeof ExportMessages>;
    Records: ReturnType<typeof ExportRecords>;
    User: ReturnType<typeof ExportUser>;
  }
}
