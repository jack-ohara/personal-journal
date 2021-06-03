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
  console.log(password);
  const passwordHash = createPasswordHash(password);
  console.log(`hash: ${passwordHash}`);
  console.log(`data: ${data}`);
  const bytes = CryptoJs.AES.decrypt(data, passwordHash);

  console.log(`bytes: ${bytes}`);

  const string = bytes.toString(CryptoJs.enc.Utf8);

  console.log(`string: ${string}`);

  return JSON.parse(string).fileContents;
}
