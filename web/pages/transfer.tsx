import React, { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { SERVER } from '../lib/constants';

export default function Transfer() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('0.00001');
  const [currency, setCurrency] = useState<string>('sol');
  const [recipient, setRecipient] = useState<PublicKey | null | string>(null);

  const searchParams = new URLSearchParams();
  const reference = useMemo(() => Keypair.generate().publicKey, []);
  searchParams.append('reference', reference.toString());

  async function getTransaction() {
    if (!publicKey || !recipient) return;

    searchParams.append('amount', amount);
    searchParams.append('currency', currency);
    searchParams.append('recipient', recipient?.toString());

    const body = {
      account: publicKey.toString(),
    };

    const response = await fetch(`${SERVER}tx/transfer?${searchParams.toString()}`, {
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
  }

  async function trySendTransaction() {
    if (!transaction) return;
    try {
      const txHash = await sendTransaction(transaction, connection);
      if (txHash) {
        setTxHash(txHash);

        if (!publicKey || !recipient) return;
        const body = {
          sender: publicKey.toString(),
          recipient,
          amount,
          currency,
          hash: txHash,
        };

        await fetch(`${SERVER}tx`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    trySendTransaction();
  }, [transaction]);

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <div>
      <label>Recipient: </label><input type='text' onChange={(e) => setRecipient(e.target.value)} />
      <label>Sum: </label><input type='number' onChange={(e) => setAmount(e.target.value)} min='0' value={amount} />
      <label>Currency: </label>
      <select onChange={(e) => setCurrency(e.target.value)}>
        <option value='sol'>SOL</option>
        <option value='usdc'>USDC</option>
      </select>

      <button onClick={getTransaction}>confirm</button>

      {(transaction && !txHash) && <p>Please approve the transaction using your wallet</p>}
      {txHash && <p>Your transaction was successful</p>}
    </div>
  )
}
