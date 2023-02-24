import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { SERVER } from '../../lib/constants';

function Transactions() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [transactionsSol, setTransactionsSol] = useState<any[]>([]);
  const [transactionsUsdc, setTransactionsUsdc] = useState<any[]>([]);
  const [limit, setLimit] = useState('10');

  async function getTransactions() {
    if (publicKey) {
      const response = await fetch(`${SERVER}transactions?account=${publicKey?.toString()}&limit=${limit}`);
      const data = await response.json();
      if (response.status !== 200) {
        console.error(data);
        return;
      }

      setTransactionsSol(data.transactionsSol);
      setTransactionsUsdc(data.transactionsUsdc);
    }
  }

  useEffect(() => {
    getTransactions();
  }, [publicKey, limit]);

  return (
    <div>
      <label>Number of transactions:</label>
      <select onChange={(e) => setLimit(e.target.value)}>
        <option value='10'>10</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
        <option value='200'>200</option>
        <option value='500'>500</option>
      </select>

      <div>
        SOL account:
        <table className='transactionsTable'>
          <thead>
            <tr>
              <td>From</td>
              <td>To</td>
              <td>Amount</td>
              <td>Currency</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {!!transactionsSol.length && transactionsSol.map(tx => (
              <tr onClick={() => router.push(`/transactions/${tx.signature}`)} key={tx.signature}>
                <td>{tx.from}</td>
                <td>{tx.to}</td>
                <td>{tx.amount}</td>
                <td>{tx.currency}</td>
                <td>{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        USDC account:
        <table className='transactionsTable'>
          <thead>
            <tr>
              <td>From</td>
              <td>To</td>
              <td>Amount</td>
              <td>Currency</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {!!transactionsUsdc.length && transactionsUsdc.map(tx => (
              <tr onClick={() => router.push(`/transactions/${tx.signature}`)} key={tx.signature}>
                <td>{tx.from}</td>
                <td>{tx.to}</td>
                <td>{tx.amount}</td>
                <td>{tx.currency}</td>
                <td>{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions;
