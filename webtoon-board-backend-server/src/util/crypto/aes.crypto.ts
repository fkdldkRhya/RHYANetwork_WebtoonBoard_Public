import { AES, enc } from "crypto-js";

export function getAesEncryptionValueAsync(value: string, key: string) : Promise<string> {
    return new Promise<string>((resolve) => {
        try {
            resolve(AES.encrypt(value, key).toString());
        }catch (error) {
            resolve(null);
        }
    });
}

export function getAesDecryptionValueAsync(value: string, key: string) : Promise<string> {
    return new Promise<string>((resolve) => {
        try {
            resolve(AES.decrypt(value, key).toString(enc.Utf8));
        }catch (error) {
            resolve(null);
        }
    });
}