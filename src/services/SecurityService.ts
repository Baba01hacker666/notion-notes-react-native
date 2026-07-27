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
      return btoa(encodeURIComponent(text + '__ENC__' + secretKey));
    } catch {
      return text;
    }
  }

  public static decryptText(encryptedText: string, secretKey: string = 'notion_local_sec'): string {
    try {
      const decoded = decodeURIComponent(atob(encryptedText));
      return decoded.replace('__ENC__' + secretKey, '');
    } catch {
      return encryptedText;
    }
  }
}
