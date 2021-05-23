import { Context } from 'egg';

export default function () {
  return async (ctx: Context, next: any) => {
    const { socket } = ctx;
    socket.emit('res', 'connected');
    await next();
    console.log('disconnection!');
  };
}