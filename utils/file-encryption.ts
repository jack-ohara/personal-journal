import CryptoJs from "crypto-js";

function createPasswordHash(key: string): string {
  return CryptoJs.SHA3(key).toString(CryptoJs.enc.Hex);
}

export function encryptFile(fileContents: string, password: string) {
  return CryptoJs.AES.encrypt(
    JSON.stringify({ fileContents }),
    createPasswordHash(password)
  ).toString();
}

export function decryptFile(data: string, password: string): string {
  const bytes = CryptoJs.AES.decrypt(data, createPasswordHash(password));

  const string = bytes.toString(CryptoJs.enc.Utf8);

  return JSON.parse(string).fileContents;
}
