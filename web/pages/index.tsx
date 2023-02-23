import { useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SERVER } from '../lib/constants';
import Transfer from './transfer';
import Balance from './balance';
import Transactions from './transactions';


export default function Login() {
  const { publicKey } = useWallet();

  useEffect(() => {
    getOrSaveUser();
    localStorage.setItem('address', String(publicKey));
  }, [publicKey])

  const getOrSaveUser = async () => {
    if (publicKey) await fetch(`${SERVER}login/${String(publicKey)}`);
  };

  return (
    <div>
      <WalletMultiButton />
      <Balance />

      <div>
        <Link href='/transfer'><Transfer /></Link>
        <Link href='/transactions'><Transactions /></Link>
      </div>
    </div>
  )
}
