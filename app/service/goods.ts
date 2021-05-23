import { Service } from 'egg';
import mongoose = require('mongoose');
import { THIRD_TYPE } from '../constant/goods';

const ObjectId = mongoose.Types.ObjectId;
export default class Test extends Service {
  // 发布商品
  async releaseGoods(data: any) {
    const { authorization } = this.ctx.header;
    const [firstType, secondType, thirdType] = data.type;
    const releaseGood = await this.ctx.model.Goods.create({
      ...data,
      userID: authorization,
      firstType,
      secondType,
      thirdType,
    });
    await this.ctx.model.Records.create({
      userID: authorization,
      goodID: releaseGood._id,
      type: 'release',
    })
    return true;
  }

  // 查找商品
  async getGood({ _id, authorization }) {
    const [goodInfo] = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(_id),
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" },
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
            preference: 0,
            coinNum: 0,
            password: 0,
            gender: 0,
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
      }
    ])
    const ifInRecord = await this.ctx.model.Records.find({
      userID: authorization,
      goodID: _id,
      type: 'collect',
    })
    goodInfo.isCollect = ifInRecord.length !== 0 && ifInRecord[0].status === 'open';
    return goodInfo;
  }

  // 搜索商品
  async searchGoods({ reg, authorization }) {
    const res = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          goodName: reg,
          userID: { $ne: authorization },
          status: 'onSale',
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" },
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
      }
    ]);
    return res;
  }

  async searchByType({ searchData, authorization }) {
    const res = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          thirdType: searchData,
          userID: { $ne: authorization },
          status: 'onSale',
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" },
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
      }
    ])
    return res;
  }

  async searchByFilter({ type, certification, lowPrice, highPrice, authorization }) {
    let searchType: any[] = [];
    if (type.length === 0) {
      searchType = THIRD_TYPE;
    } else {
      searchType = [type[2]];
    }
    const certificationType = certification === 'all' ?
      [
        'notSubmit',
        'underReview',
        'pass',
        'faild',
      ] :
      [
        'pass',
      ]
    console.log(searchType, certificationType, lowPrice, highPrice)
    const res = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          thirdType: { $in: searchType },
          userID: { $ne: authorization },
          status: 'onSale',
          price: { $gte: lowPrice }
        }
      },
      {
        $match: {
          price: { $lte: highPrice }
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" },
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
        $match: {
          'user.certificationStatus': { $in: certificationType }
        }
      },
      {
        $project: {
          user: {
            _id: 0,
            preference: 0,
            coinNum: 0,
            password: 0,
            gender: 0,
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
      }
    ])
    console.log(res)
    return res;
  }


  // 修改商品
  async updateGoodInfo({ _id, type, ...data }) {
    const [firstType, secondType, thirdType] = type;
    if (data.goodAddr.length === 0) {
      delete data.goodAddr;
    }
    return await this.ctx.model.Goods.updateOne({ _id: ObjectId(_id) }, {
      ...data,
      firstType,
      secondType,
      thirdType,
    })
  }

  // 撤销商品发布
  async revokeGood({ goodID }) {
    await this.ctx.model.Goods.updateOne({ _id: ObjectId(goodID) }, {
      status: 'revoked',
    })
    return true;
  }

  // 购买商品
  async submitOrder({ user, goodID }) {
    const [res] = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          _id: ObjectId(goodID)
        }
      },
      {
        $project: {
          price: 1,
          userID: 1,
          _id: 0,
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" }
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userid',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: "$user",
      }
    ])
    const [userCoinNum] = await this.ctx.model.User.aggregate([
      {
        $match: {
          _id: ObjectId(user)
        }
      },
      {
        $project: {
          coinNum: 1,
          _id: 0,
        }
      }
    ])
    if (!(res.price > userCoinNum.coinNum)) {
      await this.ctx.model.Goods.updateOne({
        _id: ObjectId(goodID)
      }, {
        status: 'done'
      })
      await this.ctx.model.User.updateOne({
        _id: ObjectId(res.userID)
      }, {
        coinNum: res.user.coinNum + res.price
      })
      await this.ctx.model.User.updateOne({
        _id: ObjectId(user)
      }, {
        coinNum: userCoinNum.coinNum - res.price
      })
      await this.ctx.model.Records.create({
        userID: user,
        goodID,
        type: 'buy',
      })
      await this.ctx.model.Records.create({
        userID: res.user._id,
        goodID,
        type: 'sold',
      })
      return true;
    } else {
      return false;
    }
  }

  // 推荐商品
  async userRecommendGoods({ _id }: any) {
    const idPool: any[] = [];
    const userIDPool: any[] = [];
    // 随机推荐
    const recommedWithRandom = async (size: number) => {
      return await this.ctx.model.Goods.aggregate([
        {
          $match: {
            _id: { $nin: idPool },
            userID: { $nin: userIDPool },
            status: 'onSale',
          }
        },
        {
          $sample: {
            size,
          }
        },
        {
          $addFields: {
            userid: { $toObjectId: "$userID" }
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
              password: 0
            }
          }
        }
      ]);
    }
    if (!_id) return recommedWithRandom(20);
    userIDPool.push(_id);
    const { preference } = await this.ctx.model.User.findById(_id);
    const recommedById: any = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          firstType: {
            $in: preference,
          },
          userID: { $ne: _id },
          status: 'onSale',
        }
      },
      {
        $sample: {
          size: 10,
        }
      },
      {
        $addFields: {
          userid: { $toObjectId: "$userID" }
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
            password: 0
          }
        }
      }
    ]);
    recommedById.map((item: any) => {
      idPool.push(mongoose.Types.ObjectId(item._id));
    })
    // 添加随机推荐商品
    const recommedByRandom = await recommedWithRandom(20 - recommedById.length);
    return [...recommedById, ...recommedByRandom];
  }
}