import { model, Schema } from 'mongoose';
import { IUser } from './user.types';

const UserSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);