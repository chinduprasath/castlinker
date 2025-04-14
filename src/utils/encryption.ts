
import * as nacl from 'tweetnacl';
import * as base64 from '@stablelib/base64';
import { encode as encodeUTF8, decode as decodeUTF8 } from '@stablelib/utf8';

export class E2EEncryption {
    // Generate a new key pair for a user
    static generateUserKeys(): { publicKey: string; privateKey: string } {
        const keyPair = nacl.box.keyPair();
        return {
            publicKey: base64.encode(keyPair.publicKey),
            privateKey: base64.encode(keyPair.secretKey),
        };
    }

    // Encrypt message for a recipient
    static async encryptMessage(
        message: string,
        senderPrivateKey: string,
        recipientPublicKey: string
    ): Promise<{ encrypted: string; iv: string }> {
        const iv = nacl.randomBytes(24);
        const encrypted = nacl.box(
            encodeUTF8(message),
            iv,
            base64.decode(recipientPublicKey),
            base64.decode(senderPrivateKey)
        );

        return {
            encrypted: base64.encode(encrypted),
            iv: base64.encode(iv),
        };
    }

    // Decrypt message from a sender
    static async decryptMessage(
        encrypted: string,
        iv: string,
        senderPublicKey: string,
        recipientPrivateKey: string
    ): Promise<string> {
        const decrypted = nacl.box.open(
            base64.decode(encrypted),
            base64.decode(iv),
            base64.decode(senderPublicKey),
            base64.decode(recipientPrivateKey)
        );

        if (!decrypted) {
            throw new Error('Failed to decrypt message');
        }

        return decodeUTF8(decrypted);
    }

    // Encrypt file
    static async encryptFile(
        file: File
    ): Promise<{ fileKey: string; encryptedFile: Uint8Array }> {
        const fileKey = nacl.randomBytes(32);
        const iv = nacl.randomBytes(24);

        const fileBuffer = await file.arrayBuffer();
        const fileData = new Uint8Array(fileBuffer);

        const encrypted = nacl.secretbox(fileData, iv, fileKey);

        // Combine IV and encrypted data
        const encryptedFile = new Uint8Array(iv.length + encrypted.length);
        encryptedFile.set(iv);
        encryptedFile.set(encrypted, iv.length);

        return {
            fileKey: base64.encode(fileKey),
            encryptedFile,
        };
    }

    // Decrypt file
    static async decryptFile(
        encryptedFile: Uint8Array,
        fileKey: string
    ): Promise<Uint8Array> {
        const key = base64.decode(fileKey);
        const iv = encryptedFile.slice(0, 24);
        const data = encryptedFile.slice(24);

        const decrypted = nacl.secretbox.open(data, iv, key);

        if (!decrypted) {
            throw new Error('Failed to decrypt file');
        }

        return decrypted;
    }

    // Encrypt file key for a recipient
    static async encryptFileKey(
        fileKey: string,
        recipientPublicKey: string,
        senderPrivateKey: string
    ): Promise<{ encrypted: string; iv: string }> {
        return this.encryptMessage(fileKey, senderPrivateKey, recipientPublicKey);
    }

    // Decrypt file key from a sender
    static async decryptFileKey(
        encryptedKey: string,
        iv: string,
        senderPublicKey: string,
        recipientPrivateKey: string
    ): Promise<string> {
        return this.decryptMessage(
            encryptedKey,
            iv,
            senderPublicKey,
            recipientPrivateKey
        );
    }
}
