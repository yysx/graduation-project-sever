import { CERTIFICATION_STATUS } from '../constant/user';

export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    gender: { type: String, require: true },
    preference: { type: Array },
    email: { type: String, unique: true, require: true },
    avatarAddr: { type: String },
    coinNum: { type: Number, default: 0, require: true },
    address: { type: String },
    certificationStatus: { type: String, enum: CERTIFICATION_STATUS, default: 'notSubmit', require: true },
    realName: { type: String },
    IDNumber: { type: String },
    college: { type: String },
    stuNumber: { type: String },
    gradeMajor: { type: String },
    IDAddrFront: { type: String },
    IDAddrBack: { type: String },
  });
  return mongoose.model('user', UserSchema, 'user');
};