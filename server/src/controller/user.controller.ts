import {Request, Response} from 'express';
import { IUser } from '../db/user/user.types';
import UserSchema from '../db/user/user.schema';

export const login = async (req: Request, res: Response) => {
  // @ts-ignore
  const { account } = req.params as IUser;
  if (!account || account === null) {
    res.status(400).json({error: 'No params provided'});
    return;
  }

  try {
    let user = await UserSchema.findOne({ account });
    if (!user) user = await UserSchema.create({ account });

    res.status(200).json(user);
  } catch (e) {
    res.status(404).json('User not found');
  }
};
