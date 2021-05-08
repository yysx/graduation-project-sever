export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: {
      type: String,
      index: {
        unique: true,
      },
      require: true,
    },
    nickname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
    }
  });
  return mongoose.model('user', UserSchema, 'user');
};