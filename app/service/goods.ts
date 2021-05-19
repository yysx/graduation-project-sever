import { Service } from 'egg';
import mongoose = require('mongoose');

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
    console.log(releaseGood);
    console.log(typeof releaseGood._id);
    await this.ctx.model.Records.create({
      userID: authorization,
      goodID: releaseGood._id,
      type: 'release',
    })
    return true;
  }

  // 推荐商品
  async userRecommendGoods({ _id }: any) {
    const idPool: any[] = [];
    // 随机推荐
    const recommedWithRandom = async (size: number) => {
      return await this.ctx.model.Goods.aggregate([
        {
          $match: {
            _id: { $nin: idPool },
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
    const { preference } = await this.ctx.model.User.findById(_id);
    const recommedById: any = await this.ctx.model.Goods.aggregate([
      {
        $match: {
          firstType: {
            $in: preference,
          }
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