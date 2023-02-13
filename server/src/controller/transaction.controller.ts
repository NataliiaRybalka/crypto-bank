import {Request, Response} from 'express';
import { ITransaction } from '../db/transaction/transaction.types';
import TransactionSchema from '../db/transaction/transaction.schema';

export const saveTx = async (req: Request, res: Response) => {
  const { sender, recipient, amount, currency, hash } = req.body as ITransaction;
  if (!sender || !recipient || !amount || !currency || !hash) {
    res.status(400).json({error: 'No params provided'});
    return;
  }

  try {
    const tx = await TransactionSchema.create({ sender, recipient, amount, currency, hash });
    res.status(200).json(tx);
  } catch (e) {
    res.status(500).json('Something went wrong');
  }
};