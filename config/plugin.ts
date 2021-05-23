import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  }
};

export default plugin;
