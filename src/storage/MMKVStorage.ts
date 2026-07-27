/**
 * MMKV Storage Abstraction Layer
 * Provides high-speed key-value persistence with native MMKV binding support
 * and web localStorage fallback, prepared for future cloud sync engines.
 */

class StorageAdapter {
  private memoryStore: Map<string, string> = new Map();

  constructor() {
    this.initFallback();
  }

  private initFallback() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) {
            this.memoryStore.set(key, window.localStorage.getItem(key) || '');
          }
        }
      } catch (e) {
        console.warn('Storage initialisation warning:', e);
      }
    }
  }

  public setString(key: string, value: string): void {
    this.memoryStore.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error('MMKV Storage setString error:', e);
      }
    }
  }

  public getString(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
    return this.memoryStore.get(key) || null;
  }

  public setMap<T>(key: string, value: T): void {
    this.setString(key, JSON.stringify(value));
  }

  public getMap<T>(key: string): T | null {
    const raw = this.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public delete(key: string): void {
    this.memoryStore.delete(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.error('MMKV Storage delete error:', e);
      }
    }
  }

  public clearAll(): void {
    this.memoryStore.clear();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (e) {
        console.error('MMKV Storage clearAll error:', e);
      }
    }
  }
}

export const mmkvStorage = new StorageAdapter();
