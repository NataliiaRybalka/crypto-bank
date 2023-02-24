import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { SERVER } from '../../lib/constants';

function Balance() {
  const { publicKey } = useWallet();

  const [sol, setSol] = useState(0);
  const [usdc, setUsdc] = useState(0);

  async function getBalance() {
    if (publicKey) {
      const response = await fetch(`${SERVER}balance/${publicKey?.toString()}`);
      const data = await response.json();
      if (response.status !== 200) {
        console.error(data);
        return;
      }
      
      setSol(data.sol);
      setUsdc(data.usdc);
    }
  }

  useEffect(() => {
    getBalance();
  }, [publicKey]);

  return (
    <div className='balance'>
      <p>Balance: {sol} SOL</p>
      <p>Balance: {usdc} USDC</p>
    </div>
  )
}

export default Balance;
