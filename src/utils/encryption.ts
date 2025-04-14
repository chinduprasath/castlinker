import * as nacl from 'tweetnacl';
import { Base64 } from '@stablelib/base64';

// Simple utility for base64 encoding/decoding
const encodeBase64 = (data: Uint8Array): string => Base64.encode(data);
const decodeBase64 = (text: string): Uint8Array => Base64.decode(text);

// UTF-8 encoding/decoding functions
const encodeUTF8 = (text: string): Uint8Array => {
  return new TextEncoder().encode(text);
};

const decodeUTF8 = (data: Uint8Array): string => {
  return new TextDecoder().decode(data);
};

export class E2EEncryption {
  // Static methods for encryption and decryption
  static generateKeyPair() {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: encodeBase64(keyPair.publicKey),
      privateKey: encodeBase64(keyPair.secretKey)
    };
  }

  static encryptMessage(message: string, senderPrivateKey: string, recipientPublicKey: string) {
    try {
      const messageUint8 = encodeUTF8(message);
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      
      const senderPrivateKeyUint8 = decodeBase64(senderPrivateKey);
      const recipientPublicKeyUint8 = decodeBase64(recipientPublicKey);
      
      const encrypted = nacl.box(
        messageUint8,
        nonce,
        recipientPublicKeyUint8,
        senderPrivateKeyUint8
      );
      
      return {
        encrypted: encodeBase64(encrypted),
        nonce: encodeBase64(nonce)
      };
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  static decryptMessage(
    message: { 
      content_encrypted: string; 
      iv: string; 
      sender_public_key: string 
    }, 
    recipientPrivateKey: string
  ) {
    try {
      const encrypted = decodeBase64(message.content_encrypted);
      const nonce = decodeBase64(message.iv);
      const senderPublicKey = decodeBase64(message.sender_public_key);
      const recipientPrivateKeyUint8 = decodeBase64(recipientPrivateKey);
      
      const decrypted = nacl.box.open(
        encrypted,
        nonce,
        senderPublicKey,
        recipientPrivateKeyUint8
      );
      
      if (!decrypted) return null;
      
      return decodeUTF8(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
  
  static encryptFile(file: File, senderPrivateKey: string, recipientPublicKey: string): Promise<any> {
    // Implement file encryption if needed
    return Promise.resolve({
      encrypted: "encrypted_file_placeholder",
      nonce: "nonce_placeholder"
    });
  }
}
