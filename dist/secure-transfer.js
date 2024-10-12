"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SecureTransferSDK = /*#__PURE__*/function () {
  function SecureTransferSDK(config) {
    _classCallCheck(this, SecureTransferSDK);
    if (!config.key) {
      throw new Error('Missing required configuration option: key');
    }
    this.config = config;
    this.isServer = !!config.isServer;
  }
  return _createClass(SecureTransferSDK, [{
    key: "generateSessionKey",
    value: function generateSessionKey() {
      if (this.isServer) {
        throw new Error('Session key generation is only available on the client side');
      }
      try {
        var sessionKey = _crypto["default"].randomBytes(32);
        var encryptedSessionKey = _crypto["default"].publicEncrypt({
          key: this.config.key,
          padding: _crypto["default"].constants.RSA_PKCS1_OAEP_PADDING
        }, sessionKey);
        return {
          encryptedSessionKey: encryptedSessionKey.toString('base64'),
          plainSessionKey: sessionKey.toString('hex')
        };
      } catch (error) {
        console.error('Error generating session key:', error);
        throw new Error('Failed to generate session key');
      }
    }
  }, {
    key: "validateSessionKey",
    value: function validateSessionKey(encryptedSessionKey) {
      if (!this.isServer) {
        throw new Error('Session key validation is only available on the server side');
      }
      try {
        var decryptedSessionKey = _crypto["default"].privateDecrypt({
          key: this.config.key,
          padding: _crypto["default"].constants.RSA_PKCS1_OAEP_PADDING
        }, Buffer.from(encryptedSessionKey, 'base64'));
        return decryptedSessionKey.toString('hex');
      } catch (error) {
        console.error('Error validating session key:', error);
        throw new Error('Failed to validate session key');
      }
    }
  }, {
    key: "encrypt",
    value: function encrypt(data) {
      try {
        // Generate a random AES key
        var aesKey = _crypto["default"].randomBytes(32);

        // Encrypt the AES key with RSA
        var encryptedAesKey = _crypto["default"].publicEncrypt({
          key: this.config.key,
          padding: _crypto["default"].constants.RSA_PKCS1_OAEP_PADDING
        }, aesKey);

        // Use AES to encrypt the actual data
        var iv = _crypto["default"].randomBytes(16);
        var cipher = _crypto["default"].createCipheriv('aes-256-cbc', aesKey, iv);
        var encryptedData = cipher.update(data, 'utf8', 'base64');
        encryptedData += cipher["final"]('base64');

        // Combine the encrypted AES key, IV, and encrypted data
        return JSON.stringify({
          key: encryptedAesKey.toString('base64'),
          iv: iv.toString('base64'),
          data: encryptedData
        });
      } catch (error) {
        console.error('Error encrypting data:', error);
        throw new Error('Failed to encrypt data');
      }
    }
  }, {
    key: "decrypt",
    value: function decrypt(encryptedPackage) {
      if (!this.isServer) {
        throw new Error('Decryption is only available on the server side');
      }
      try {
        var _JSON$parse = JSON.parse(encryptedPackage),
          key = _JSON$parse.key,
          iv = _JSON$parse.iv,
          data = _JSON$parse.data;

        // Decrypt the AES key
        var aesKey = _crypto["default"].privateDecrypt({
          key: this.config.key,
          padding: _crypto["default"].constants.RSA_PKCS1_OAEP_PADDING
        }, Buffer.from(key, 'base64'));

        // Use AES to decrypt the actual data
        var decipher = _crypto["default"].createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
        var decryptedData = decipher.update(data, 'base64', 'utf8');
        decryptedData += decipher["final"]('utf8');
        return decryptedData;
      } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Failed to decrypt data');
      }
    }
  }]);
}();
var _default = exports["default"] = SecureTransferSDK;