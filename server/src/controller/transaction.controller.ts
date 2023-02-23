import { Request, Response } from 'express';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, getAssociatedTokenAddress, createTransferCheckedInstruction } from '@solana/spl-token';
import BigNumber from 'bignumber.js';
import { usdcAddress } from '../lib/addresses';

// import { extract } from 'solana-transaction-extractor';

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const connection = new Connection(endpoint);

export const postTransfer = async (req: Request, res: Response) => {
  const {recipient, currency, amount, reference} = req.query;
  const {account} = req.body;

  if (!account || !recipient || !currency || !amount || !reference) {
    res.status(400).json({error: 'No params provided'});
    return;
  }

  const sum = new BigNumber(amount as string);
  if (sum.toNumber() === 0) return;

  try {
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

export const getTransactions = async (req: Request, res: Response) => {
  const { account } = req.query;
  let limit = Number(req.query.limit) || 10;
  if (!account) {
    res.status(400).json({error: 'No params provided'});
    return;
  }

  const signatures = await connection.getSignaturesForAddress(new PublicKey(account), { limit });
  const signaturesList = signatures.map(sign => sign.signature);  
  const transactionsList = await connection.getParsedTransactions(signaturesList);
  // const transactions = await Promise.all(
  //   transactionsList.map((transactionData) => extract(transactionData)),
  // );

  // const transactionsSol = transactions.filter((tx) => tx.currency === 'sol');
  // const transactionsUsdc = transactions.filter((tx) => tx.currency === 'usdc');

  res.status(200).json({
    transactionsSol: 'ok',
    transactionsUsdc: 'ok',
  });
};

export const getTransaction = async (req: Request, res: Response) => {
  const { hash } = req.params;
  if (!hash) {
    res.status(400).json({error: 'No params provided'});
    return;
  }
  const tx = await getTx(hash);

  res.status(200).json({
    tx,
  });
  return tx;
};

export const getTx = async (hash: string) => await connection.getTransaction(hash, { maxSupportedTransactionVersion: 0 });

const getTransactionCount = async () => await connection.getTransactionCount();
