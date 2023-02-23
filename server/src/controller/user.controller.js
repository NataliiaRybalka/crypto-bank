"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.getUser = exports.getBalance = void 0;
var _walletAdapterBase = require("@solana/wallet-adapter-base");
var _web = require("@solana/web3.js");
var _user = _interopRequireDefault(require("../db/user/user.schema"));
var _addresses = require("../lib/addresses");
var _splToken = require("@solana/spl-token");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const network = _walletAdapterBase.WalletAdapterNetwork.Devnet;
const endpoint = (0, _web.clusterApiUrl)(network);
const connection = new _web.Connection(endpoint);
const login = async (req, res) => {
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
const getUser = async (req, res) => {
  const {
    account
  } = req.query;
  if (!account) {
    res.status(400).json({
      error: 'Account is not specified'
    });
    return;
  }
  const user = await _user.default.findOne({
    account
  });
  if (!user) {
    res.status(400).json({
      error: 'Merchant is not defined'
    });
    return;
  }
  res.status(200).json({
    user
  });
};
exports.getUser = getUser;
const getBalance = async (req, res) => {
  const {
    account
  } = req.params;
  if (!account) {
    res.status(400).json({
      error: 'Account is not specified'
    });
    return;
  }
  const sol = await connection.getBalance(new _web.PublicKey(account));
  const associatedTokenAddress = await (0, _splToken.getAssociatedTokenAddress)(_addresses.usdcAddress, new _web.PublicKey(account));
  const usdc = await connection.getTokenAccountBalance(associatedTokenAddress);
  res.status(200).json({
    sol: sol / _web.LAMPORTS_PER_SOL,
    usdc: usdc.value.uiAmount
  });
};
exports.getBalance = getBalance;