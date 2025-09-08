import { importKey, encryptData } from "./crypto";

export const updateEncryptedUser = async (user) => {
  const key = await importKey();
  const { encrypted, iv } = await encryptData(user, key);
  localStorage.setItem("user_encrypted", encrypted);
  localStorage.setItem("user_iv", iv);
};
