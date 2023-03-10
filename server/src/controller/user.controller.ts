import { Request, Response } from 'express';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import UserSchema from '../db/user/user.schema';
import { usdcAddress } from '../lib/addresses';
import { getAssociatedTokenAddress, getMint } from '@solana/spl-token';

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const connection = new Connection(endpoint);

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
  const {account} = req.query;  
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

export const getBalance = async (req: Request, res: Response) => {
  const {account} = req.params;  
  if (!account) {
    res.status(400).json({error: 'Account is not specified'});
    return;
  }

  const sol = await connection.getBalance(new PublicKey(account));

  const associatedTokenAddress = await getAssociatedTokenAddress(usdcAddress, new PublicKey(account));
  const usdc = await connection.getTokenAccountBalance(associatedTokenAddress);

  res.status(200).json({
    sol: sol / LAMPORTS_PER_SOL,
    usdc: usdc.value.uiAmount,
  });
};
