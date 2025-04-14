
import { box, randomBytes, secretbox } from 'tweetnacl';
import { 
    encode as encodeBase64, 
    decode as decodeBase64 
} from '@stablelib/base64';
import { 
    encode as encodeUTF8,
    decode as decodeUTF8
} from '@stablelib/utf8';

export class E2EEncryption {
    // Generate a new key pair for a user
    generateUserKeys(): { publicKey: string; privateKey: string } {
        const keyPair = box.keyPair();
        return {
            publicKey: encodeBase64(keyPair.publicKey),
            privateKey: encodeBase64(keyPair.secretKey),
        };
    }

    // Encrypt message for a recipient
    async encryptMessage(
        message: string,
        senderPrivateKey: string,
        recipientPublicKey: string
    ): Promise<{ encrypted: string; iv: string }> {
        const iv = randomBytes(24);
        const encrypted = box(
            encodeUTF8(message),
            iv,
            decodeBase64(recipientPublicKey),
            decodeBase64(senderPrivateKey)
        );

        return {
            encrypted: encodeBase64(encrypted),
            iv: encodeBase64(iv),
        };
    }

    // Decrypt message from a sender
    async decryptMessage(
        encrypted: string,
        iv: string,
        senderPublicKey: string,
        recipientPrivateKey: string
    ): Promise<string> {
        const decrypted = box.open(
            decodeBase64(encrypted),
            decodeBase64(iv),
            decodeBase64(senderPublicKey),
            decodeBase64(recipientPrivateKey)
        );

        if (!decrypted) {
            throw new Error('Failed to decrypt message');
        }

        return decodeUTF8(decrypted);
    }

    // Encrypt file
    async encryptFile(
        file: File
    ): Promise<{ fileKey: string; encryptedFile: Uint8Array }> {
        const fileKey = randomBytes(32);
        const iv = randomBytes(24);

        const fileBuffer = await file.arrayBuffer();
        const fileData = new Uint8Array(fileBuffer);

        const encrypted = secretbox(fileData, iv, fileKey);

        // Combine IV and encrypted data
        const encryptedFile = new Uint8Array(iv.length + encrypted.length);
        encryptedFile.set(iv);
        encryptedFile.set(encrypted, iv.length);

        return {
            fileKey: encodeBase64(fileKey),
            encryptedFile,
        };
    }

    // Decrypt file
    async decryptFile(
        encryptedFile: Uint8Array,
        fileKey: string
    ): Promise<Uint8Array> {
        const key = decodeBase64(fileKey);
        const iv = encryptedFile.slice(0, 24);
        const data = encryptedFile.slice(24);

        const decrypted = secretbox.open(data, iv, key);

        if (!decrypted) {
            throw new Error('Failed to decrypt file');
        }

        return decrypted;
    }

    // Encrypt file key for a recipient
    async encryptFileKey(
        fileKey: string,
        recipientPublicKey: string,
        senderPrivateKey: string
    ): Promise<{ encrypted: string; iv: string }> {
        return this.encryptMessage(fileKey, senderPrivateKey, recipientPublicKey);
    }

    // Decrypt file key from a sender
    async decryptFileKey(
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
