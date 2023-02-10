import React, { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { useRouter } from 'next/router';
import { SERVER } from '../lib/constants';

export default function Transfer() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('0');
  const [currency, setCurrency] = useState<string>('sol');
  const [recipient, setRecipient] = useState<PublicKey | null | string>(null);

  const searchParams = new URLSearchParams();
  const reference = useMemo(() => Keypair.generate().publicKey, []);
  searchParams.append('reference', reference.toString());

  async function getTransaction() {
    if (!publicKey || !recipient) {
      return;
    }

    searchParams.append('amount', amount);
    searchParams.append('currency', currency);
    searchParams.append('recipient', recipient?.toString());

    const body = {
      account: publicKey.toString(),
    };

    const response = await fetch(`${SERVER}user/transfer?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (response.status !== 200) {
      console.error(json);
      return;
    }

    const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'));
    setTransaction(transaction);
    setMessage(json.message);
    console.log(transaction);
  }

  // useEffect(() => {
  //   getTransaction()
  // }, [publicKey])

  ////////////////////////////
  // // Send the fetched transaction to the connected wallet
  // async function trySendTransaction() {
  //   if (!transaction) {
  //     return;
  //   }
  //   try {
  //     await sendTransaction(transaction, connection)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  // // Send the transaction once it's fetched
  // useEffect(() => {
  //   trySendTransaction()
  // }, [transaction])

  // // Check every 0.5s if the transaction is completed
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       // Check if there is any transaction for the reference
  //       const signatureInfo = await findReference(connection, reference);
  //       router.push('/confirmed')
  //     } catch (e) {
  //       if (e instanceof FindReferenceError) {
  //         // No transaction found yet, ignore this error
  //         return;
  //       }
  //       console.error('Unknown error', e)
  //     }
  //   }, 500)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  // if (!publicKey) {
  //   return (
  //     <div>
  //       <WalletMultiButton />

  //       <p>You need to connect your wallet to make transactions</p>
  //     </div>
  //   )
  // }

  return (
    <div>
      <label>recipient</label><input type='text' onChange={(e) => setRecipient(e.target.value)} />
      <label>Sum</label><input type='number' onChange={(e) => setAmount(e.target.value)} min='0' />
      <button onClick={getTransaction}>confirm</button>

      {/* <WalletMultiButton /> */}

      {/* {message ?
        <p>{message} Please approve the transaction using your wallet</p> :
        <p>Creating transaction... </p>
      } */}
    </div>
  )
}
