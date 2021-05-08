import Controller from './baseController';

export default class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }
  async getRecentlySearch() {
    console.log(1111);
    const { ctx } = this;
    // let count = Number(ctx.cookies.get('count') || 0);
    // ctx.cookies.set('count', `${++count}`);
    // ctx.body = count;
    // ctx.body = await ctx.service.test.sayHi('egg');
    // const createRule = {
    //   title: { type: 'string' },
    //   content: { type: 'string' },
    // };
    // 校验参数
    // ctx.validate(createRule);
    // 组装参数
    // const author = ctx.session.userId;
    // const req = Object.assign(ctx.request.body, { author });
    // 调用 Service 进行业务处理
    // const res = await service.post.create(req);
    // 设置响应内容和响应状态码
    ctx.body = { data: { id: '123456' } };
  }
  async userLogin() {
    const data = this.ctx.request.body;
    const createRule = {
      username: { type: 'string' },
      password: { type: 'string' },
    };
    // 校验参数
    const err = this.ctx.validate(createRule);
    if (err) this.error(406, '参数错误');
    const res = await this.ctx.service.user.userLogin(data);
    if(res){
      this.success(res);
    }else{
      this.error(400,'用户名/邮箱或密码错误');
    }
  }
}
