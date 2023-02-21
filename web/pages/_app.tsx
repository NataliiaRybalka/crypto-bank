import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import Login from './index';

import '../styles/_app.css';
require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Login />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default MyApp;
