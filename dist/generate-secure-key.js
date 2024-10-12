"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function main() {
  var publicKey;
  var privateKey;
  var _crypto$generateKeyPa = _crypto["default"].generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }),
    pubKey = _crypto$generateKeyPa.publicKey,
    privKey = _crypto$generateKeyPa.privateKey;
  publicKey = pubKey;
  privateKey = privKey;
  return {
    publicKey: publicKey,
    privateKey: privateKey
  };
}
var _default = exports["default"] = main;