import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, io } = app;
  router.post('/login', controller.user.userLogin);
  router.post('/register', controller.user.userRegister);
  router.get('/records', controller.user.getRecords);
  router.post('/records', controller.user.updateRecords);
  router.get('/user', controller.user.getUser);
  router.put('/user', controller.user.updateUser);
  router.delete('/records', controller.user.deleteRecords);

  router.post('/releaseGoods', controller.goods.releaseGoods);
  router.get('/recommend', controller.goods.getRecommendGoods);
  router.get('/good', controller.goods.getGood);
  router.put('/good', controller.goods.updateGoodInfo);
  router.delete('/good', controller.goods.revokeGood);
  router.get('/searchGoods', controller.goods.searchGoods);
  router.get('/searchByType', controller.goods.searchByType);
  router.post('/searchByFilter', controller.goods.searchGoodsByFilter);
  router.post('/order', controller.goods.submitOrder);

  router.post('/uploadImg', controller.config.uploadImg);

  io.of('/').route('chat', io.controller.chat.getChatList);
  io.of('/').route('getChatList', io.controller.chat.getChatList);
  io.of('/').route('sendMessages', io.controller.chat.receiveMessages);
};
