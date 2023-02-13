import {Request, Response} from 'express';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { getMint, getAssociatedTokenAddress, createTransferCheckedInstruction } from '@solana/spl-token';
import BigNumber from 'bignumber.js';
import { IUser } from '../db/user/user.types';
import UserSchema from '../db/user/user.schema';
import { usdcAddress } from '../lib/addresses';

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

export const transfer = async (req: Request, res: Response) => {
  const {recipient, currency, amount, reference} = req.query;
  const {account} = req.body;

  if (!account || !recipient || !currency || !amount || !reference) {
    res.status(400).json({error: 'No params provided'});
    return;
  }

  const sum = new BigNumber(amount as string);
  if (sum.toNumber() === 0) return;

  try {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    // sol
    const buyerPublicKey = new PublicKey(account);
    const shopPublicKey = new PublicKey(recipient);

    const { blockhash } = await (connection.getLatestBlockhash('finalized'));

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    let transferInstruction;
    if (currency === 'sol') {
      transferInstruction = SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        lamports: sum.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
        toPubkey: shopPublicKey,
      });
  
      transferInstruction.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });
    } else if (currency === 'usdc') {      
      const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
      const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, shopPublicKey);
      const usdcMint = await getMint(connection, usdcAddress);

      transferInstruction = createTransferCheckedInstruction(
        buyerUsdcAddress,
        usdcAddress,
        shopUsdcAddress,
        buyerPublicKey,
        sum.toNumber() * (10 ** (await usdcMint).decimals),
        usdcMint.decimals,
      );
  
      transferInstruction.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });
    }

    if (!transferInstruction) throw new Error('Wrong currency');
    transaction.add(transferInstruction);

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    });
    const base64 = serializedTransaction.toString('base64');

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'error creating transaction'});
    return;
  }
};
