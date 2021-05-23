import Controller from './baseController';
import mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
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

  // 修改记录
  async updateRecords() {
    const { authorization } = this.ctx.header;
    const { isCollect = false, type, goodID } = this.ctx.request.body;
    if (type === 'collect' && isCollect) {
      await this.ctx.service.user.updateRecords({ authorization, type, goodID, status: 'close' });
    }
    if (type === 'collect' && !isCollect) {
      const recordData = await this.ctx.model.Records.find({
        goodID,
        userID: authorization,
        type: 'collect',
      })
      if (recordData.length === 0) {
        await this.ctx.service.user.addRecords({ authorization, type, goodID });
      } else {
        await this.ctx.service.user.updateRecords({ authorization, type, goodID, status: 'open' });
      }
    }
    this.success({});
  }

  // 获取记录
  async getRecords() {
    const data = this.ctx.request.query;
    const res = await this.ctx.service.user.getRecords(data);
    this.success(res);
  }

  // 删除记录
  async deleteRecords() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Records.updateOne({
      _id: ObjectId(_id)
    }, { status: 'close' });
    this.success({});
  }

  // 获取用户信息
  async getUser() {
    const { authorization } = this.ctx.header;
    const [userData] = await this.ctx.model.User.aggregate([
      {
        $match: {
          _id: ObjectId(authorization),
        }
      }, {
        $project: {
          password: 0
        }
      }
    ])
    this.success(userData);
  }

  // 修改用户信息
  async updateUser() {
    const data = this.ctx.request.body;
    const { authorization } = this.ctx.header;
    const res = await this.ctx.service.user.updateUser({ authorization, ...data });
    if (res.ok === 1) {
      this.success({});
    } else {
      this.error(500, '未知错误');
    }

  }
}
