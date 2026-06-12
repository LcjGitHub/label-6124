import type { StateStorage } from "zustand/middleware";

/**
 * 客户端存储工具
 * 仅在浏览器环境中可用，SSR 环境返回 undefined
 */
export function getClientStorage(): Storage | undefined {
  if (typeof window !== "undefined") {
    return localStorage;
  }
  return undefined;
}

const memoryStorage: StateStorage = {
  getItem: (_name) => null,
  setItem: (_name, _value) => {},
  removeItem: (_name) => {},
};

/**
 * 获取 zustand persist 可用的 storage
 * SSR 环境下返回一个空的内存存储实现，避免报错
 */
export function getPersistStorage(): StateStorage {
  const storage = getClientStorage();
  if (storage) {
    return {
      getItem: (name) => storage.getItem(name),
      setItem: (name, value) => storage.setItem(name, value),
      removeItem: (name) => storage.removeItem(name),
    };
  }
  return memoryStorage;
}
