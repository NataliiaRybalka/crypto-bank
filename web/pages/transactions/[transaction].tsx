import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { SERVER } from '../../lib/constants';

function Transaction() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [transaction, setTransaction] = useState<any>(null);

  async function getTransactions() {
    if (publicKey) {
      const response = await fetch(`${SERVER}transactions/${router.query.transaction}`);
      const data = await response.json();
      console.log(data);
      
      if (response.status !== 200) {
        console.error(data);
        return;
      }

    }
  }

  useEffect(() => {
    getTransactions();
  }, [publicKey]);

  return (
    <div>
      
    </div>
  )
}

export default  Transaction;
