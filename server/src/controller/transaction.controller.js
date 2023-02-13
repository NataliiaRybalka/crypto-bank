"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveTx = void 0;
var _transaction = _interopRequireDefault(require("../db/transaction/transaction.schema"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const saveTx = async (req, res) => {
  const {
    sender,
    recipient,
    amount,
    currency,
    hash
  } = req.body;
  if (!sender || !recipient || !amount || !currency || !hash) {
    res.status(400).json({
      error: 'No params provided'
    });
    return;
  }
  try {
    const tx = await _transaction.default.create({
      sender,
      recipient,
      amount,
      currency,
      hash
    });
    res.status(200).json(tx);
  } catch (e) {
    res.status(500).json('Something went wrong');
  }
};
exports.saveTx = saveTx;