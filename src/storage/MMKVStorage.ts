/**
 * Storage Abstraction Layer
 * Provides fast key-value persistence with a synchronous in-memory cache on top of:
 *  - AsyncStorage on native (Android/iOS) for real on-device persistence
 *  - window.localStorage on web (keys unchanged, so existing web data is preserved)
 *
 * The cache keeps the synchronous get/set API used across the app; writes are
 * persisted in the background. Call `init()` once at app startup.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

class StorageAdapter {
  private memoryStore: Map<string, string> = new Map();
  private _isReady: boolean = isWeb;
  private readyCallbacks: Array<() => void> = [];

  constructor() {
    if (isWeb) {
      this.hydrateFromLocalStorage();
    }
  }

  private hydrateFromLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          this.memoryStore.set(key, window.localStorage.getItem(key) || '');
        }
      }
    } catch (e) {
      console.warn('Storage hydration warning:', e);
    }
  }

  /**
   * Loads all persisted values into the in-memory cache. No-op on web (already
   * hydrated synchronously). Resolves once the cache is safe to read.
   */
  public async init(): Promise<void> {
    if (isWeb) return;
    try {
      if (AsyncStorage && typeof AsyncStorage.getAllKeys === 'function') {
        const keys = await AsyncStorage.getAllKeys();
        if (keys && keys.length > 0) {
          for (const key of keys) {
            const value = await AsyncStorage.getItem(key);
            if (value != null) {
              this.memoryStore.set(key, value);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Storage hydration failed:', e);
    }
    this._isReady = true;
    this.readyCallbacks.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.warn('Storage ready callback error:', e);
      }
    });
    this.readyCallbacks = [];
  }

  get isReady(): boolean {
    return this._isReady;
  }

  /** Invoke cb as soon as the store has been hydrated (immediately if ready). */
  public onReady(cb: () => void): void {
    if (this._isReady) {
      cb();
      return;
    }
    this.readyCallbacks.push(cb);
  }

  private persist(key: string, value: string) {
    if (isWeb) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.warn('Storage setString error:', e);
      }
      return;
    }
    try {
      AsyncStorage?.setItem?.(key, value)?.catch?.(e =>
        console.warn('Storage setString error:', e)
      );
    } catch (e) {
      console.warn('Storage setString error:', e);
    }
  }

  public setString(key: string, value: string): void {
    this.memoryStore.set(key, value);
    this.persist(key, value);
  }

  public getString(key: string): string | null {
    return this.memoryStore.get(key) ?? null;
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
    if (isWeb) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn('Storage delete error:', e);
      }
      return;
    }
    try {
      AsyncStorage?.removeItem?.(key)?.catch?.(e => console.warn('Storage delete error:', e));
    } catch (e) {
      console.warn('Storage delete error:', e);
    }
  }

  public clearAll(): void {
    this.memoryStore.clear();
    if (isWeb) {
      try {
        window.localStorage.clear();
      } catch (e) {
        console.warn('Storage clearAll error:', e);
      }
      return;
    }
    try {
      AsyncStorage?.clear?.()?.catch?.(e => console.warn('Storage clearAll error:', e));
    } catch (e) {
      console.warn('Storage clearAll error:', e);
    }
  }
}

export const mmkvStorage = new StorageAdapter();
export const initStorage = () => mmkvStorage.init();
