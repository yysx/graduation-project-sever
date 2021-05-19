import Controller from './baseController';

export default class HomeController extends Controller {
  // 用户登录
  async userLogin() {
    const data = this.ctx.request.body;
    const createRule = {
      login: { type: 'string' },
      password: { type: 'string' },
    };
    // 校验参数
    const err = this.ctx.validate(createRule);
    if (err) this.error(406, '参数错误');
    const res = await this.ctx.service.user.userLogin(data);
    if (!res.length) this.error(400, '用户名/邮箱或密码错误');
    const [resData] = res;
    this.ctx.cookies.set('userID', resData._id);
    this.success(resData);
  }

  // 用户注册
  async userRegister() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.user.userRegister(data);
    if (res === 'username') this.error(400, '该用户名已注册');
    if (res === 'email') this.error(400, '该邮箱已注册');
    this.success({});
  }

  // 获取记录
  async getRecords() {
    const data = this.ctx.request.query;
    const res = await this.ctx.service.user.getRecords(data);
    console.log(res);
    this.success(res);
  }
}
