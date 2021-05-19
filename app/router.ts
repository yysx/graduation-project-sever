import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.post('/login', controller.user.userLogin);
  router.post('/register', controller.user.userRegister);
  router.get('/records', controller.user.getRecords);

  router.post('/releaseGoods', controller.goods.releaseGoods);
  router.get('/recommend', controller.goods.getRecommendGoods);

  router.post('/uploadImg', controller.config.uploadImg);
};
