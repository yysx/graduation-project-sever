import { RECORDS_TYPE, RECORDS_STATUS } from '../constant/records';
export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    userID: { type: String, require: true },
    goodID: { type: String, require: true },
    status: { type: String, enum: RECORDS_STATUS, default: 'open', require: true },
    type: { type: String, enum: RECORDS_TYPE, require: true },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  });
  return mongoose.model('records', UserSchema, 'records');
};