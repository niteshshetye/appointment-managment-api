import crypto from 'crypto';

class Secure {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;

  constructor() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // Length of the key in bits
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  encryptWithPublicKey(data: string): string {
    const payload = Buffer.from(data);
    return crypto.publicEncrypt(this.publicKey, payload).toString('base64');
  }

  decryptWithPrivateKey(data: string): string {
    const payload = Buffer.from(data, 'base64');
    return crypto.privateDecrypt(this.privateKey, payload).toString('utf-8');
  }
}

export const secure = Object.freeze(new Secure());
