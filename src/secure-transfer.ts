import crypto from 'crypto';

interface SecureTransferConfig {
  key?: string;
  isServer?: boolean;
}

interface EncryptedPackage {
  key: string;
  iv: string;
  data: string;
}

class SecureTransferSDK {
  private config: SecureTransferConfig;
  private isServer: boolean;

  constructor(config: SecureTransferConfig) {
    if (!config.key) {
      throw new Error('Missing required configuration option: key');
    }
    this.config = config;
    this.isServer = !!config.isServer;
  }

  generateSessionKey(signature: string): { encryptedSessionKey: string; plainSessionKey: string } {
    if (this.isServer) {
      throw new Error('Session key generation is only available on the client side');
    }
  
    try {
      const sessionKey = crypto.randomBytes(32).toString('hex');
      const combinedData = `${sessionKey}:${signature}`;
      const encryptedSessionKey = crypto.publicEncrypt(
        {
          key: this.config.key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(combinedData, 'utf-8')
      ).toString('base64');
    
      return {  encryptedSessionKey: encryptedSessionKey + signature, plainSessionKey: sessionKey };
    } catch (error) {
      console.error('Error generating session key:', error);
      throw new Error('Failed to generate session key');
    }
  }
  

  validateSessionKey(encryptedSessionKey: string, expectedSignature: string): string {
    if (!this.isServer) {
      throw new Error('Session key validation is only available on the server side');
    }

    const encryptedBuffer = Buffer.from(encryptedSessionKey, 'base64');

    if (encryptedBuffer.length !== 256) {
      throw new Error('Invalid encrypted session key length');
    }

    if(!encryptedSessionKey.endsWith(expectedSignature)) {
      throw new Error('Invalid session key');
    }

    try {
      const decryptedData = crypto.privateDecrypt(
        {
          key: this.config.key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(encryptedSessionKey, 'base64')
      ).toString('utf-8');
    
      const parts = decryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid decrypted session key format');
      }
    
      const [sessionKey, signature] = parts;
    
      if (signature !== expectedSignature) {
        throw new Error('Invalid session key signature');
      }
    
      return sessionKey;
    } catch (error) {
      console.error('Error validating session key:', error);
      throw new Error('Failed to validate session key');
    }
  }
  

  encrypt(data: string): string {
    try {
      const aesKey = crypto.randomBytes(32);

      const encryptedAesKey = crypto.publicEncrypt(
        {
          key: this.config.key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        aesKey
      );

      // Use AES to encrypt the actual data
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      let encryptedData = cipher.update(data, 'utf8', 'base64');
      encryptedData += cipher.final('base64');

      // Combine the encrypted AES key, IV, and encrypted data
      const encryptedPackage: EncryptedPackage = {
        key: encryptedAesKey.toString('base64'),
        iv: iv.toString('base64'),
        data: encryptedData
      };

      return JSON.stringify(encryptedPackage);
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedPackage: string): string {
    if (!this.isServer) {
      throw new Error('Decryption is only available on the server side');
    }

    try {
      const { key, iv, data } = JSON.parse(encryptedPackage) as EncryptedPackage;

      // Decrypt the AES key
      const aesKey = crypto.privateDecrypt(
        {
          key: this.config.key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(key, 'base64')
      );

      // Use AES to decrypt the actual data
      const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
      let decryptedData = decipher.update(data, 'base64', 'utf8');
      decryptedData += decipher.final('utf8');

      return decryptedData;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

export default SecureTransferSDK;