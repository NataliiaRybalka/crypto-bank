import {Request, Response} from 'express';
import { IUser } from '../db/user.types';
import UserSchema from '../db/user.schema';

export const login = async (req: Request, res: Response) => {
  // @ts-ignore
  const address = req.params.address as IUser;
  if (!address || address === null) return;

  let user = await UserSchema.findOne({ address });
  if (!user) user = await UserSchema.create({ address });

  res.status(200).json(user);
};

// export default {
//   login,
// }