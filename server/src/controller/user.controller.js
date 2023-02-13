"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;
var _user = _interopRequireDefault(require("../db/user/user.schema"));
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