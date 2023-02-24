import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { SERVER } from '../../lib/constants';
import MetaFields from '../../components/metaFields';

function Transaction() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [tx, setTx] = useState<any>(null);

  async function getTransactions() {
    if (publicKey) {
      const response = await fetch(`${SERVER}transactions/${router.query.transaction}`);
      const data = await response.json();      
      if (response.status !== 200) {
        console.error(data);
        return;
      }

      setTx(data);
    }
  }

  useEffect(() => {
    getTransactions();
  }, [publicKey]);

  return (
    <div>
      {tx &&
      <table className='transactionTable'>
        <tbody>
          <tr>
            <td>blockTime:</td>
            <td>{tx.blockTime}</td>
          </tr>
          <tr>
            <td>meta:</td>
            <td><MetaFields fields={tx.meta} /></td>
          </tr>
          <tr>
            <td>slot:</td>
            <td>{tx.slot}</td>
          </tr>
          <tr>
            <td>transaction:</td>
            <td><MetaFields fields={tx.transaction} /></td>
            {/* <td>{JSON.stringify(tx.transaction)}</td> */}
          </tr>
        </tbody>
      </table>
      }
    </div>
  )
}

export default  Transaction;
