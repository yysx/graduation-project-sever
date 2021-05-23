import { Controller } from 'egg'
import moment = require('moment');

declare module 'egg' {
  interface CustomController {
    chat: ChatController;
  }
}

export default class ChatController extends Controller {
  async getChatList(id: string) {
    const req = this.ctx.args[0] || {};
    const reqUserID = req.userID || id;
    if (reqUserID) {
      const data = await this.ctx.model.Messages.aggregate([
        {
          $match: {
            $or: [
              { sender: reqUserID, senderStatus: { $ne: 'close' } },
              { recipient: reqUserID, recipientStatus: { $ne: 'close' } },
            ]
          }
        },
        {
          $sort: {
            createdAt: 1
          }
        },
        {
          $addFields: {
            senderid: { $toObjectId: "$sender" },
            recipientid: { $toObjectId: "$recipient" },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'senderid',
            foreignField: '_id',
            as: 'tempUserA',
          }
        },
        {
          $unwind: "$tempUserA",
        },
        {
          $project: {
            tempUserA: {
              preference: 0,
              coinNum: 0,
              password: 0,
              gender: 0,
              certificationStatus: 0,
              email: 0,
              __v: 0,
              IDAddrBack: 0,
              IDAddrFront: 0,
              IDNumber: 0,
              college: 0,
              gradeMajor: 0,
              realName: 0,
              stuNumber: 0,
            }
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'recipientid',
            foreignField: '_id',
            as: 'tempUserB',
          }
        },
        {
          $unwind: "$tempUserB",
        },
        {
          $project: {
            tempUserB: {
              preference: 0,
              coinNum: 0,
              password: 0,
              gender: 0,
              certificationStatus: 0,
              email: 0,
              __v: 0
            }
          }
        },
      ])
      const res = data.map((item: any) => {
        const user = reqUserID === String(item.tempUserA._id) ? item.tempUserB : item.tempUserA;
        delete item.tempUserA;
        delete item.tempUserB;
        return {
          user,
          ...item,
        }
      });
      this.ctx.socket.emit('talkList', res);
    }
  }

  // 接收消息
  async receiveMessages() {
    const data = this.ctx.args[0] || {}; // 获取客户端传来的数据包
    const { sender, recipient, content } = data;
    const createdAt = moment();
    await this.ctx.model.Messages.findOneAndUpdate({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ]
    }, {
      sender,
      recipient,
      senderStatus: 'open',
      recipientStatus: 'open',
      $push: {
        content: { sender, recipient, content, createdAt }
      }
    }, {
      upsert: true,
      useFindAndModify: false
    })
    this.getChatList(sender);

    const namespace = this.app.io.of('/');
    namespace.emit('updateMessage', { sender, recipient, content });
    // console.log(ifExistTalkRecords);
    // this.ctx.socket.emit('updateMessage', { sender, recipient, content });
  }
}
