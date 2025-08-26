import { envs } from 'lib/env/MnestixEnv';
import crypto, { createDecipheriv } from 'crypto';

const keyB64 = envs.SECRET_ENC_KEY;
if (!keyB64) {
    throw new Error('Encryption key is not defined');
}

const KEY = Buffer.from(keyB64, 'base64');
if (KEY.length !== 32) throw new Error('SECRET_ENC_KEY must be a base64-encoded 32-byte key (44 characters)');

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
