import { FIRST_TYPE, SECOND_TYPE, THIRD_TYPE, GOOD_STATUS } from '../constant/goods';
export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    userID: { type: String, require: true },
    goodName: { type: String, require: true },
    firstType: { type: String, enum: FIRST_TYPE, require: true },
    secondType: { type: String, enum: SECOND_TYPE, require: true },
    thirdType: { type: String, enum: THIRD_TYPE, require: true },
    pageviews: { type: Number, default: 0, require: true },
    price: { type: Number, default: 0, require: true },
    goodAddr: { type: Array, require: true },
    status: { type: String, enum: GOOD_STATUS, default: 'onSale', require: true },
    content: { type: String, require: true },
    message: { type: Array },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  });
  return mongoose.model('goods', UserSchema, 'goods');
};