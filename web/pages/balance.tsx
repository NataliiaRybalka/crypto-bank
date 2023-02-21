import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { SERVER } from '../lib/constants';

export default function Balance() {
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState(0);

  async function getBalance() {
    if (publicKey) {
      const response = await fetch(`${SERVER}balance/${publicKey?.toString()}`);
      const data = await response.json();
      if (response.status !== 200) {
        console.error(data);
        return;
      }
      
      setBalance(data);
    }
  }

  useEffect(() => {
    getBalance();
  }, [publicKey]);

  return (
    <div>
      Balance: {balance} SOL
    </div>
  )
}
