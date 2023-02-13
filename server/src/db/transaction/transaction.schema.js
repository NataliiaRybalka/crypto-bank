"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
const TransactionSchema = new _mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['sol', 'usdc']
  }
}, {
  timestamps: true
});
var _default = (0, _mongoose.model)('Transaction', TransactionSchema);
exports.default = _default;