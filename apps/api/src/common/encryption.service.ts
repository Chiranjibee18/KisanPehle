import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptedPayload {
  encryptedValue: string; // Base64 ciphertext
  iv: string;             // Base64 12-byte IV
  authTag: string;        // Base64 16-byte GCM authentication tag
}

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly key: Buffer;

  constructor() {
    const rawKey = process.env.ENCRYPTION_KEY || 'IPBw2WVmtfTSNQcnZK5RPid8exEE3cNBcXN1YBaHd1k=';
    const keyBuf = Buffer.from(rawKey, 'base64');
    
    if (keyBuf.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (256 bits) encoded in base64');
    }
    this.key = keyBuf;
  }

  /**
   * Encrypts a sensitive string using AES-256-GCM with a unique 12-byte random IV
   */
  encrypt(plaintext: string): string {
    if (!plaintext) return plaintext;
    try {
      // 1. Generate 12-byte random IV (NIST recommendation for GCM)
      const iv = crypto.randomBytes(12);

      // 2. Initialize cipher in AES-256-GCM mode
      const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

      // 3. Encrypt plaintext
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // 4. Extract 16-byte authentication tag
      const authTag = cipher.getAuthTag().toString('base64');
      const ivBase64 = iv.toString('base64');

      // 5. Pack as tamper-evident string: enc:v1:<iv>:<authTag>:<ciphertext>
      return `enc:v1:${ivBase64}:${authTag}:${encrypted}`;
    } catch (err: any) {
      this.logger.error('Encryption failure occurred (sensitive details suppressed)');
      throw new Error('Failed to securely protect sensitive data');
    }
  }

  /**
   * Decrypts an AES-256-GCM encrypted string, validating the authentication tag
   */
  decrypt(ciphertextStr: string): string {
    if (!ciphertextStr || !ciphertextStr.startsWith('enc:v1:')) {
      // Return as-is if not encrypted with this format
      return ciphertextStr;
    }

    try {
      const parts = ciphertextStr.split(':');
      if (parts.length !== 5) {
        throw new Error('Malformed encrypted payload format');
      }

      const iv = Buffer.from(parts[2], 'base64');
      const authTag = Buffer.from(parts[3], 'base64');
      const encryptedText = parts[4];

      if (iv.length !== 12 || authTag.length !== 16) {
        throw new Error('Invalid IV or auth tag length in encrypted payload');
      }

      // Initialize decipher in AES-256-GCM mode
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt and verify
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (err: any) {
      this.logger.warn('Decryption verification failure (tamper-evident tag mismatch or invalid key)');
      // Return safe masked string or throw generic error
      return '[Protected Information]';
    }
  }

  /**
   * Returns an object representation with distinct fields for database storage
   */
  encryptToPayload(plaintext: string): EncryptedPayload | null {
    if (!plaintext) return null;
    const packed = this.encrypt(plaintext);
    const parts = packed.split(':');
    return {
      iv: parts[2],
      authTag: parts[3],
      encryptedValue: parts[4],
    };
  }

  /**
   * Decrypts from payload object
   */
  decryptFromPayload(payload: EncryptedPayload): string {
    if (!payload?.encryptedValue || !payload?.iv || !payload?.authTag) {
      return '';
    }
    return this.decrypt(`enc:v1:${payload.iv}:${payload.authTag}:${payload.encryptedValue}`);
  }
}
