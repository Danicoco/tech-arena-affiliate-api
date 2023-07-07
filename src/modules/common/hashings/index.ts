import { createHash } from "crypto";
import { AES, enc } from "crypto-js";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

import { catchError } from "../utils";

const { ENCRYPTIONIV, ENCRYPTIONKEY } = process.env;

if (typeof ENCRYPTIONIV !== "string" || typeof ENCRYPTIONKEY !== "string") {
    throw catchError('ADD ENCRYPTION KEYS');
}

export const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const matchPassword = (password: string, hash: string) =>
  compareSync(password, hash);

export const createHash215 = (value: string) => {
  const Hash = createHash("sha512");
  return Hash.update(value, "utf-8").digest("hex");
};

export const decrytData = (message: string) => {
  const enMessage = AES.decrypt(message, String(ENCRYPTIONKEY));
  return enMessage.toString(enc.Utf8);
}

export const encryptData = (message: string) => {
  const bytes  = AES.encrypt(message, String(ENCRYPTIONKEY));
 return bytes.toString();
}
