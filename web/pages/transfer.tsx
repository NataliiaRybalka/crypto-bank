import { useEffect, useMemo, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction, clusterApiUrl, Connection } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { createQR, encodeURL, findReference, FindReferenceError, TransactionRequestURLFields } from '@solana/pay';
import { SERVER, SERVER_NGROK } from '../lib/constants';

export default function Transfer() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);
  const { publicKey, sendTransaction } = useWallet();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isTx, setIsTx] = useState<boolean>(false);
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

    const data = await response.json();

    if (response.status !== 200) {
      console.error(data);
      return;
    }

    const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'));
    setTransaction(transaction);
  }

  async function trySendTransaction() {
    if (!transaction) return;
    try {
      await sendTransaction(transaction, connection);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    trySendTransaction();
  }, [transaction]);

  let url: URL;  
  if (publicKey && recipient && confirm === 'qr') {
    searchParams.append('amount', amount.toString());
    searchParams.append('currency', currency);
    searchParams.append('recipient', recipient.toString());
    searchParams.append('account', publicKey.toString());

    const apiUrl = `${SERVER_NGROK}tx/transfer?${searchParams.toString()}`;    
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    };
    url = encodeURL(urlParams);
  }

  useEffect(() => {
    const qr = createQR(url, 512, 'transparent')
    if (qrRef.current && amount > 0 && confirm === 'qr') {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    };
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
        if (signatureInfo) setIsTx(true);
      } catch (e) {
        if (e instanceof FindReferenceError) return;
        console.error('Unknown error', e)
      }
    }, 500)
    return () => clearInterval(interval);
  }, []);

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <div className='transferTable'>
      <div>
        <label>Recipient: </label><input type='text' onChange={(e) => setRecipient(e.target.value)} />
      </div>
      <div>
        <label>Sum: </label><input type='number' onChange={(e) => setAmount(Number(e.target.value))} min='0' value={amount} />
      </div>
      <div>
        <label>Currency: </label>
        <select onChange={(e) => setCurrency(e.target.value)}>
          <option value='sol'>SOL</option>
          <option value='usdc'>USDC</option>
        </select>
      </div>

      <div>
        <label>Confirm via: </label>
        <select onChange={(e) => setConfirm(e.target.value)}>
          <option value='phantom'>Phantom extension</option>
          <option value='qr'>QR-code</option>
        </select>
      </div>

      {confirm === 'phantom' && <button onClick={getTransaction}>confirm</button>}

      {(transaction && !isTx) && <p className='approveAlert'>Please approve the transaction using your wallet</p>}
      {isTx && <p className='confirmAlert'>Your transaction was successful</p>}

      <div ref={qrRef} />
    </div>
  )
}

// 89D7KBRL4xnfotkdVojgCmWNNp6wpqBqaufSHwUNuoMu