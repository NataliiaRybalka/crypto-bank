import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction, clusterApiUrl, Connection, } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { createQR, encodeURL, TransferRequestURLFields } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { SERVER } from '../lib/constants';
import { usdcAddress } from '../lib/addresses';

export default function Transfer() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);
  const { publicKey, sendTransaction } = useWallet();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0.00001);
  const [currency, setCurrency] = useState<string>('sol');
  const [recipient, setRecipient] = useState<PublicKey | null | string>(null);
  const [confirm, setConfirm] = useState<string>('phantom');

  const qrRef = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams();
  const reference = useMemo(() => Keypair.generate().publicKey, []);
  searchParams.append('reference', reference.toString());

  async function getTransaction() {
    if (!publicKey || !recipient) return;

    searchParams.append('amount', amount.toString());
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

  // const amount = useMemo(() => calculatePrice(router.query), [router.query]);

  let url: URL;
  if (recipient && confirm === 'qr') {
    if (currency === 'sol') {
      const urlParams: TransferRequestURLFields = {
        recipient: new PublicKey(recipient),
        amount: new BigNumber(amount),
        reference,
      };
      url = encodeURL(urlParams);
    } else if (currency === 'usdc') {
      const urlParams: TransferRequestURLFields = {
        recipient: new PublicKey(recipient),
        splToken: usdcAddress,
        amount: new BigNumber(amount),
        reference,
      };
      url = encodeURL(urlParams);
    }
  }

  useEffect(() => {
    const qr = createQR(url, 512, 'transparent')
    if (qrRef.current && amount > 0 && confirm === 'qr') {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  });

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
      <label>Sum: </label><input type='number' onChange={(e) => setAmount(Number(e.target.value))} min='0' value={amount} />
      <label>Currency: </label>
      <select onChange={(e) => setCurrency(e.target.value)}>
        <option value='sol'>SOL</option>
        <option value='usdc'>USDC</option>
      </select>

      <select onChange={(e) => setConfirm(e.target.value)}>
        <option value='phantom'>Phantom extension</option>
        <option value='qr'>qr-code</option>
      </select>

      {confirm === 'phantom' && <button onClick={getTransaction}>confirm</button>}

      {(transaction && !txHash) && <p>Please approve the transaction using your wallet</p>}
      {txHash && <p>Your transaction was successful</p>}

      <div ref={qrRef} />
    </div>
  )
}
