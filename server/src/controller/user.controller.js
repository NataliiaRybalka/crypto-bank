"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.getUser = void 0;
var _user = _interopRequireDefault(require("../db/user/user.schema"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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