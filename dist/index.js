"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SecureTransferSDK", {
  enumerable: true,
  get: function get() {
    return _secureTransfer["default"];
  }
});
Object.defineProperty(exports, "generatePublicAndPrivateKey", {
  enumerable: true,
  get: function get() {
    return _generateSecureKey["default"];
  }
});
var _secureTransfer = _interopRequireDefault(require("./secure-transfer.js"));
var _generateSecureKey = _interopRequireDefault(require("./generate-secure-key.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }