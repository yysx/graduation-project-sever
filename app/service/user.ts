import { Service } from 'egg';
import { md5 } from 'utility';
import mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

export default class Test extends Service {
  // 用户登录
  async userLogin({ login, password }) {
    const loginVerify = await this.ctx.model.User.aggregate([
      {
        $match: {
          $or: [
            { username: login, password: md5(password) },
            { email: login, password: md5(password) },
          ]
        }
      },
      {
        $project: {
          password: 0,
        }
      }
    ]);
    return loginVerify;
  }

  // 用户注册
  async userRegister(data: any) {
    const { username, email, password } = data;
    const ifUsername = await this.ctx.model.User.find({ username });
    if (ifUsername.length) return 'username';
    const ifEmail = await this.ctx.model.User.find({ email });
    if (ifEmail.length) return 'email';
    data.password = md5(password);
    await this.ctx.model.User.create(data);
    return true;
  }

  // 用户查询记录
  async getRecords(data: any) {
    const { type } = data;
    const { authorization } = this.ctx.header;
    return await this.ctx.model.Records.aggregate([
      {
        $match: {
          userID: authorization,
          type,
        }
      },
      {
        $addFields: {
          goodid: { $toObjectId: "$goodID" },
          userid: { $toObjectId: "$userID" },
        },
      },
      {
        $lookup: {
          from: 'goods',
          localField: 'goodid',
          foreignField: '_id',
          as: 'goods',
        }
      },
      {
        $unwind: "$goods",
      },
      {
        $project: {
          goods: {
            pageviews: 0,
            message: 0,
            __v: 0,
          }
        }
      },
      {
        $match: {
          status: { $ne: 'close' }
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$goods.userID" },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userid',
          foreignField: '_id',
          as: 'user',
        }
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: {
            _id: 0,
            preference: 0,
            coinNum: 0,
            password: 0,
            gender: 0,
            certificationStatus: 0,
            email: 0,
            __v: 0
          }
        }
      }
    ])
  }

  // 增加记录
  async addRecords({ authorization, ...data }: any) {
    await this.ctx.model.Records.create({
      userID: authorization,
      ...data,
    })
    return;
  }

  // 修改记录
  async updateRecords({ authorization, type, goodID, status }) {
    await this.ctx.model.Records.updateOne({
      userID: authorization,
      goodID,
      type,
    }, {
      status,
    })

  }

  // 修改用户信息
  async updateUser({ authorization, password, ...data }) {
    if (password) {
      password = md5(password);
      return await this.ctx.model.User.updateOne({
        _id: ObjectId(authorization),
      }, { password, ...data });
    } else {
      return await this.ctx.model.User.updateOne({
        _id: ObjectId(authorization),
      }, data);
    }
  }
}
