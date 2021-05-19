import { Service } from 'egg';
import { md5 } from 'utility';

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
    console.log(type);
    console.log(authorization);
    return await this.ctx.model.Records.aggregate([
      {
        $match: {
          userID: authorization,
          type
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
            userID: 0,
            __v: 0,
          }
        }
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
}
