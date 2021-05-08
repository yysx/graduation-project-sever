import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/getRecentlySearch', controller.home.getRecentlySearch);
  router.post('/login', controller.home.userLogin);
};
