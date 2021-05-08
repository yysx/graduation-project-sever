// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRequest from '../../../app/middleware/request';

declare module 'egg' {
  interface IMiddleware {
    request: typeof ExportRequest;
  }
}
