import { decode } from "punycode";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SECRET_KEY = "0123456789abcdef0123456789abcdef";

export async function importKey(secret = SECRET_KEY) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: any, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(JSON.stringify(data));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptData(
  encryptedStr: string,
  ivstr: string,
  key: CryptoKey
) {
  const encryptedData = Uint8Array.from(atob(encryptedStr), (c) =>
    c.charCodeAt(0)
  );
  const iv = Uint8Array.from(atob(ivstr), (c) => c.charCodeAt(0));
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );

  return JSON.parse(decoder.decode(decryptedBuffer));
}
