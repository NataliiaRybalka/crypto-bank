"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;
var _user = _interopRequireDefault(require("../db/user.schema"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const login = async (req, res) => {
  // @ts-ignore
  const address = req.params.address;
  if (!address || address === null) return;
  let user = await _user.default.findOne({
    address
  });
  if (!user) user = await _user.default.create({
    address
  });
  res.status(200).json(user);
};

// export default {
//   login,
// }
exports.login = login;