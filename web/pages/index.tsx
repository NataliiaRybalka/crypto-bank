import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SERVER } from '../lib/constants';
import Transfer from './transfer';

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
      <Transfer />
    </div>
  )
}
