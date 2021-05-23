import { MESSAGE_STATUS_TYPE } from '../constant/messages';
export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    sender: { type: String, require: true },
    recipient: { type: String, require: true },
    senderStatus: { type: String, enum: MESSAGE_STATUS_TYPE, default: 'open', require: true },
    recipientStatus: { type: String, enum: MESSAGE_STATUS_TYPE, default: 'open', require: true },
    content: { type: Array, require: true },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  });
  return mongoose.model('messages', UserSchema, 'messages');
};