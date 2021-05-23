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

  // 查找商品
  async getGood() {
    const { authorization } = this.ctx.header;
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.service.goods.getGood({ _id, authorization });
    this.success(res);
  }

  // 发布商品
  async releaseGoods() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.goods.releaseGoods(data);
    if (res) {
      this.success({});
    }
  }

  // 修改商品
  async updateGoodInfo() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.goods.updateGoodInfo(data);
    if (res.ok === 1) {
      this.success({});
    }
  }

  // 搜索商品
  async searchGoods() {
    const { authorization } = this.ctx.header;
    const { searchData } = this.ctx.request.query;
    const reg = new RegExp(searchData);
    const res = await this.ctx.service.goods.searchGoods({ reg, authorization });
    this.success(res);
  }

  // 按类型搜索商品
  async searchByType() {
    const { authorization } = this.ctx.header;
    const { searchData } = this.ctx.request.query;
    const res = await this.ctx.service.goods.searchByType({ searchData, authorization });
    this.success(res);
  }

  async searchGoodsByFilter() {
    const { authorization } = this.ctx.header;
    const query = this.ctx.request.body;
    const res = await this.ctx.service.goods.searchByFilter({ ...query, authorization });
    this.success(res);
  }

  // 撤销发布
  async revokeGood() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.goods.revokeGood(data);
    if (res) {
      this.success({});
    }
  }

  // 购买商品
  async submitOrder() {
    const data = this.ctx.request.body;
    const res = await this.ctx.service.goods.submitOrder(data);
    if (res) {
      this.success({});
    } else {
      this.error(400, '账户易币数量不足');
    }
  }
}