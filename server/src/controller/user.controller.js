"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transfer = exports.login = void 0;
var _walletAdapterBase = require("@solana/wallet-adapter-base");
var _web = require("@solana/web3.js");
var _splToken = require("@solana/spl-token");
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _user = _interopRequireDefault(require("../db/user/user.schema"));
var _addresses = require("../lib/addresses");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const login = async (req, res) => {
  // @ts-ignore
  const {
    account
  } = req.params;
  if (!account || account === null) {
    res.status(400).json({
      error: 'No params provided'
    });
    return;
  }
  try {
    let user = await _user.default.findOne({
      account
    });
    if (!user) user = await _user.default.create({
      account
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json('User not found');
  }
};
exports.login = login;
const transfer = async (req, res) => {
  const {
    recipient,
    currency,
    amount,
    reference
  } = req.query;
  const {
    account
  } = req.body;
  if (!account || !recipient || !currency || !amount || !reference) {
    res.status(400).json({
      error: 'No params provided'
    });
    return;
  }
  const sum = new _bignumber.default(amount);
  if (sum.toNumber() === 0) return;
  try {
    const network = _walletAdapterBase.WalletAdapterNetwork.Devnet;
    const endpoint = (0, _web.clusterApiUrl)(network);
    const connection = new _web.Connection(endpoint);

    // sol
    const buyerPublicKey = new _web.PublicKey(account);
    const shopPublicKey = new _web.PublicKey(recipient);
    const {
      blockhash
    } = await connection.getLatestBlockhash('finalized');
    const transaction = new _web.Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey
    });
    let transferInstruction;
    if (currency === 'sol') {
      transferInstruction = _web.SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        lamports: sum.multipliedBy(_web.LAMPORTS_PER_SOL).toNumber(),
        toPubkey: shopPublicKey
      });
      transferInstruction.keys.push({
        pubkey: new _web.PublicKey(reference),
        isSigner: false,
        isWritable: false
      });
    } else if (currency === 'usdc') {
      const buyerUsdcAddress = await (0, _splToken.getAssociatedTokenAddress)(_addresses.usdcAddress, buyerPublicKey);
      const shopUsdcAddress = await (0, _splToken.getAssociatedTokenAddress)(_addresses.usdcAddress, shopPublicKey);
      const usdcMint = await (0, _splToken.getMint)(connection, _addresses.usdcAddress);
      transferInstruction = (0, _splToken.createTransferCheckedInstruction)(buyerUsdcAddress, _addresses.usdcAddress, shopUsdcAddress, buyerPublicKey, sum.toNumber() * 10 ** (await usdcMint).decimals, usdcMint.decimals);
      transferInstruction.keys.push({
        pubkey: new _web.PublicKey(reference),
        isSigner: false,
        isWritable: false
      });
    }
    if (!transferInstruction) throw new Error('Wrong currency');
    transaction.add(transferInstruction);
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    });
    const base64 = serializedTransaction.toString('base64');
    res.status(200).json({
      transaction: base64
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'error creating transaction'
    });
    return;
  }
};
exports.transfer = transfer;