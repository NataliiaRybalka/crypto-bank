import { model, Schema } from 'mongoose';
import { ITransaction } from './transaction.types';

const TransactionSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ['sol', 'usdc'],
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ITransaction>('Transaction', TransactionSchema);