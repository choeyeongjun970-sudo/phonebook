import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-32-chars-long!!';

/**
 * 데이터를 암호화합니다.
 * @param text 평문 데이터
 * @returns 암호화된 문자열 (AES-256)
 */
export function encrypt(text: string): string {
    if (!text) return '';
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

/**
 * 암호화된 데이터를 복호화합니다.
 * @param cipherText 암호화된 문자열
 * @returns 복호화된 평문 데이터
 */
export function decrypt(cipherText: string): string {
    if (!cipherText) return '';
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
