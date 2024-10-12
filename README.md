# Secure Transfer SDK

A robust and efficient SDK for secure data transfer in JavaScript applications, providing advanced encryption and decryption capabilities for sensitive information transmission.

## Features

- RSA key pair generation for secure communication
- Session key generation and validation for enhanced security
- Hybrid encryption (RSA + AES) for efficient and secure data transfer
- Support for both client-side and server-side operations
- Easy-to-use API for seamless integration

## Installation

Install the Secure Transfer SDK using npm:

```bash
npm install secure-transfer-sdk
```

## Usage

```
import SecureTransferSDK from 'secure-transfer-sdk';
```


### Generating RSA Keys

```const { publicKey, privateKey } = generateSecureKey();
```

### Client-side Usage

```const clientSDK = new SecureTransferSDK({ key: publicKey });
const { encryptedSessionKey, plainSessionKey } = clientSDK.generateSessionKey();
const sensitiveData = 'Secret message';
const encryptedData = clientSDK.encrypt(sensitiveData);
```

### Server-side Usage

```const serverSDK = new SecureTransferSDK({ key: privateKey, isServer: true });

// Validate session key
const validatedSessionKey = serverSDK.validateSessionKey(encryptedSessionKey);

// Decrypt data
const decryptedData = serverSDK.decrypt(encryptedData);
```


## Contributing

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please ensure your code adheres to the existing style and passes all tests.


## License

This project is licensed under the ISC License.

Copyright (c) 2023 Kishan Kumar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


