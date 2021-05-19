import Controller from './baseController';

export default class HomeController extends Controller {
  // 获取推荐商品
  async getRecommendGoods() {
    const { ctx } = this;
    const { ifLogin } = ctx.request.query;
    if (ifLogin === 'true') {
      const { _id } = ctx.request.query;
      const res = await this.ctx.service.goods.userRecommendGoods({ _id });
      this.success(res);
    } else {
      const res = await this.ctx.service.goods.userRecommendGoods({});
      this.success(res);
    }
  }

  // 发布商品
  async releaseGoods() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.goods.releaseGoods(data);
    if (res) {
      this.success({});
    }
  }
}