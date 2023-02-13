"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usdcAddress = void 0;
var _web = require("@solana/web3.js");
const USDC_ADDRESS = process.env.USDC_ADDRESS || 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';
const usdcAddress = new _web.PublicKey(USDC_ADDRESS);
exports.usdcAddress = usdcAddress;