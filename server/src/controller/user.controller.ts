import {Request, Response} from 'express';
import UserSchema from '../db/user/user.schema';

export const login = async (req: Request, res: Response) => {
  const { account } = req.params;
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

export const getUser = async (req: Request, res: Response) => {
  const { account } = req.query;
  if (!account) {
    res.status(400).json({error: 'Account is not specified'});
    return;
  }

  const user = await UserSchema.findOne({ account });
  if (!user) {
    res.status(400).json({error: 'Merchant is not defined'});
    return;
  }

  res.status(200).json({ user });
};
