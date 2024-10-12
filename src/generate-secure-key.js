import crypto from 'crypto';

function main() {
    let publicKey;
    let privateKey;
    const {publicKey: pubKey, privateKey: privKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {type: 'spki', format: 'pem'},
        privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    });
    publicKey = pubKey;
    privateKey = privKey;

    return {
        publicKey,
        privateKey
    }
}

export default main