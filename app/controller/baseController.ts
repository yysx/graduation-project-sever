const { Controller } = require('egg');
export default class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data: any) {
    this.ctx.body = {
      data,
      code: 200,
    };
  }

  error(status: number, msg: string) {
    msg = msg || 'not found';
    status = status || 404;
    this.ctx.throw(status, msg);
  }
}