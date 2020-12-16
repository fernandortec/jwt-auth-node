import mongoose, { HookNextFunction, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserSchemaType extends Document {
  name: string;
  email: string;
  password: string;
  acess_token?: string;
  refresh_token?: string;
  createdAt?: Date;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  acess_token: {
    type: String,
    required:false,
  },

  refresh_token: {
    type: String,
    required:false,
  }
});

UserSchema.pre<UserSchemaType>('save', async function (next: HookNextFunction) {
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;

  next();
});

export default mongoose.model<UserSchemaType>('User', UserSchema);
