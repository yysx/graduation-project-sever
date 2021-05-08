import { Service } from 'egg';

export default class Test extends Service {

  async userLogin({ username, password }) {
    const res = await this.ctx.model.User.findOne({ username, password });
    return res;
  }
}
