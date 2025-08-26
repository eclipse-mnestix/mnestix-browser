import { envs } from 'lib/env/MnestixEnv';
import crypto, { createDecipheriv } from 'crypto';

let keyB64 = envs.SECRET_ENC_KEY;
if (!keyB64) {
    console.warn(
        '[Encryption] No encryption key found in environment variables. ' +
            'A random key will be generated for this session. ' +
            'Note: This is insecure and should only be used for local development. ' +
            'Please set SECRET_ENC_KEY in your production environment.',
    );
    keyB64 = crypto.randomBytes(32).toString('base64');
}

const KEY = Buffer.from(keyB64, 'base64');

export function encryptSecret(plainText: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
    const cipherText = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const cipherTextB64 = cipherText.toString('base64');
    const ivB64 = iv.toString('base64');
    const authTagB64 = authTag.toString('base64');

    return { cipherTextB64, ivB64, authTagB64 };
}

export function decryptSecret(cipherText64: string, iv64: string, authTag64: string): string {
    const cipherText = Buffer.from(cipherText64, 'base64');
    const iv = Buffer.from(iv64, 'base64');
    const authTag = Buffer.from(authTag64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(authTag);
    const plain = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return plain.toString('utf8');
}
