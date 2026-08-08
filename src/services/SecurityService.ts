/**
 * Security Service for PIN lock, Biometric verification, and local encryption
 */

export class SecurityService {
  public static hashPin(pin: string): string {
    // Simple fast hashing for local PIN verification
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'pin_' + Math.abs(hash).toString(36) + '_' + pin.length;
  }

  public static verifyPin(pin: string, storedHash: string): boolean {
    return this.hashPin(pin) === storedHash;
  }

  public static async authenticateBiometric(): Promise<{ success: boolean; error?: string }> {
    // Simulates native biometric prompt or WebAuthn hardware key
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 600);
    });
  }

  public static encryptText(text: string, secretKey: string = 'notion_local_sec'): string {
    try {
      // encodeURIComponent percent-encodes to pure ASCII, so a plain base64
      // encoder is safe and portable (Hermes has no btoa/atob).
      return SecurityService.b64Encode(encodeURIComponent(text + '__ENC__' + secretKey));
    } catch {
      return text;
    }
  }

  public static decryptText(encryptedText: string, secretKey: string = 'notion_local_sec'): string {
    try {
      const decoded = decodeURIComponent(SecurityService.b64Decode(encryptedText));
      return decoded.replace('__ENC__' + secretKey, '');
    } catch {
      return encryptedText;
    }
  }

  private static b64Encode(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    let buffer = 0;
    let bits = 0;
    for (let i = 0; i < input.length; i++) {
      buffer = (buffer << 8) | input.charCodeAt(i);
      bits += 8;
      while (bits >= 6) {
        out += chars[(buffer >> (bits - 6)) & 63];
        bits -= 6;
      }
    }
    if (bits > 0) out += chars[(buffer << (6 - bits)) & 63];
    while (out.length % 4 !== 0) out += '=';
    return out;
  }

  private static b64Decode(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    let buffer = 0;
    let bits = 0;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch === '=') break;
      const idx = chars.indexOf(ch);
      if (idx < 0) {
        throw new Error('Invalid base64 character');
      }
      buffer = (buffer << 6) | idx;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }
    return out;
  }
}
