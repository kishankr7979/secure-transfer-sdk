import { SecureTransferSDK } from '../src/index';
import crypto from 'crypto';

describe('SecureTransferSDK', () => {
  let clientSDK;
  let serverSDK;
  let publicKey;
  let privateKey;

  beforeAll(() => {
    // Generate a key pair for testing
    const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    publicKey = pubKey;
    privateKey = privKey;
  });

  beforeEach(() => {
    clientSDK = new SecureTransferSDK({ key: publicKey });
    serverSDK = new SecureTransferSDK({ key: privateKey, isServer: true });
  });

  test('generateSessionKey method (client-side)', () => {
    const { encryptedSessionKey, plainSessionKey } = clientSDK.generateSessionKey();
    expect(encryptedSessionKey).toBeDefined();
    expect(plainSessionKey).toBeDefined();
    expect(typeof encryptedSessionKey).toBe('string');
    expect(typeof plainSessionKey).toBe('string');
  });

  test('validateSessionKey method (server-side)', () => {
    const { encryptedSessionKey, plainSessionKey } = clientSDK.generateSessionKey();
    const validatedSessionKey = serverSDK.validateSessionKey(encryptedSessionKey);
    expect(validatedSessionKey).toBe(plainSessionKey);
  });

  test('encrypt and decrypt methods with session key', () => {
    const testData = 'sensitive information';
    const { plainSessionKey } = clientSDK.generateSessionKey();
    
    const encryptedData = clientSDK.encrypt(testData, plainSessionKey);
    expect(encryptedData).not.toBe(testData);

    const decryptedData = serverSDK.decrypt(encryptedData, plainSessionKey);
    expect(decryptedData).toBe(testData);
  });

  test('generateSessionKey throws error on server-side', () => {
    expect(() => {
      serverSDK.generateSessionKey();
    }).toThrow('Session key generation is only available on the client side');
  });

  test('validateSessionKey throws error on client-side', () => {
    expect(() => {
      clientSDK.validateSessionKey('someEncryptedKey');
    }).toThrow('Session key validation is only available on the server side');
  });

  test('constructor throws error when key is missing', () => {
    expect(() => {
      new SecureTransferSDK({});
    }).toThrow('Missing required configuration option: key');
  });

  // Additional tests for edge cases and error handling
  test('encrypt and decrypt methods', () => {
    const testData = 'sensitive information';

    const encryptedData = clientSDK.encrypt(testData);
    expect(encryptedData).not.toBe(testData);

    const decryptedData = serverSDK.decrypt(encryptedData);
    expect(decryptedData).toBe(testData);
  });

  test('encrypt handles empty string', () => {
    const encryptedData = clientSDK.encrypt('');
    expect(encryptedData).not.toBe('');
    const decryptedData = serverSDK.decrypt(encryptedData);
    expect(decryptedData).toBe('');
  });

  test('decrypt throws error for invalid encrypted data', () => {
    expect(() => {
      serverSDK.decrypt('invalid_encrypted_data');
    }).toThrow('Failed to decrypt data');
  });

  test('encrypt and decrypt with large data', () => {
    const largeData = 'x'.repeat(1000000);
    const encryptedData = clientSDK.encrypt(largeData);
    const decryptedData = serverSDK.decrypt(encryptedData);
    expect(decryptedData).toBe(largeData);
  });
});