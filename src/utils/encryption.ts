// 암호화/복호화 유틸리티
// 여기에 코드를 작성하세요
import crypto from "crypto";

// 암호화 설정 상수
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export class EncryptionService {
  private static deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, "sha512");
  }

  static encrypt(text: string, password: string): string {
    try {
      const salt = crypto.randomBytes(SALT_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);

      const key = this.deriveKey(password, salt);

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      cipher.setAAD(Buffer.from("greensupia-encryption", "utf8"));

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      const tag = cipher.getAuthTag();

      return (
        salt.toString("hex") +
        ":" +
        iv.toString("hex") +
        ":" +
        tag.toString("hex") +
        ":" +
        encrypted
      );
    } catch (error) {
      throw new Error(
        `암호화 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static decrypt(encryptedData: string, password: string): string {
    try {
      const parts = encryptedData.split(":");
      if (parts.length !== 4) {
        throw new Error("잘못된 암호화 데이터 형식입니다.");
      }

      const [saltHex, ivHex, tagHex, encrypted] = parts;

      const salt = Buffer.from(saltHex, "hex");
      const iv = Buffer.from(ivHex, "hex");
      const tag = Buffer.from(tagHex, "hex");

      const key = this.deriveKey(password, salt);

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAAD(Buffer.from("greensupia-encryption", "utf8"));
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error(
        `복호화 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static hashPassword(password: string): string {
    try {
      const salt = crypto.randomBytes(16);
      const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, "sha512");
      return salt.toString("hex") + ":" + hash.toString("hex");
    } catch (error) {
      throw new Error(
        `비밀번호 해시 생성 실패: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [saltHex, hashHex] = hashedPassword.split(":");
      if (!saltHex || !hashHex) {
        return false;
      }
      const salt = Buffer.from(saltHex, "hex");
      const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, "sha512");
      return crypto.timingSafeEqual(hash, Buffer.from(hashHex, "hex"));
    } catch {
      return false;
    }
  }

  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}

// 편의 함수들
export const encrypt = (text: string, password: string) =>
  EncryptionService.encrypt(text, password);
export const decrypt = (encryptedData: string, password: string) =>
  EncryptionService.decrypt(encryptedData, password);
export const hashPassword = (password: string) =>
  EncryptionService.hashPassword(password);
export const verifyPassword = (password: string, hashedPassword: string) =>
  EncryptionService.verifyPassword(password, hashedPassword);
export const generateRandomString = (length?: number) =>
  EncryptionService.generateRandomString(length);
