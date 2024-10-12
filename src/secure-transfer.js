import crypto from 'crypto';

class SecureTransferSDK {
    constructor(config) {
        if (!config.key) {
            throw new Error('Missing required configuration option: key');
        }
        this.config = config;
        this.isServer = !!config.isServer;
    }

    generateSessionKey() {
        if (this.isServer) {
            throw new Error('Session key generation is only available on the client side');
        }

        try {
            const sessionKey = crypto.randomBytes(32);
            const encryptedSessionKey = crypto.publicEncrypt(
                {
                    key: this.config.key,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                sessionKey
            );

            return {
                encryptedSessionKey: encryptedSessionKey.toString('base64'),
                plainSessionKey: sessionKey.toString('hex')
            };
        } catch (error) {
            console.error('Error generating session key:', error);
            throw new Error('Failed to generate session key');
        }
    }

    validateSessionKey(encryptedSessionKey) {
        if (!this.isServer) {
            throw new Error('Session key validation is only available on the server side');
        }

        try {
            const decryptedSessionKey = crypto.privateDecrypt(
                {
                    key: this.config.key,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                Buffer.from(encryptedSessionKey, 'base64')
            );

            return decryptedSessionKey.toString('hex');
        } catch (error) {
            console.error('Error validating session key:', error);
            throw new Error('Failed to validate session key');
        }
    }

    encrypt(data) {
        try {
            // Generate a random AES key
            const aesKey = crypto.randomBytes(32);

            // Encrypt the AES key with RSA
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

    decrypt(encryptedPackage) {
        if (!this.isServer) {
            throw new Error('Decryption is only available on the server side');
        }

        try {
            const { key, iv, data } = JSON.parse(encryptedPackage);

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