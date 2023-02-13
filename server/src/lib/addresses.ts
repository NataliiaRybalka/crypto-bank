import {PublicKey} from '@solana/web3.js';

const USDC_ADDRESS = process.env.USDC_ADDRESS || 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';

export const usdcAddress = new PublicKey(USDC_ADDRESS);
