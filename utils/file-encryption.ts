import CryptoJs from "crypto-js";

function createPasswordHash(key: string): string {
  return CryptoJs.SHA256(key).toString();
}

export function encryptFile(fileContents: string, password: string) {
  return CryptoJs.AES.encrypt(
    JSON.stringify({ fileContents }),
    createPasswordHash(password)
  ).toString();
}

export function decryptFile(data: string, password: string) {
  const bytes = CryptoJs.AES.decrypt(data, createPasswordHash(password));

  return bytes.toString(CryptoJs.enc.Utf8);
}
