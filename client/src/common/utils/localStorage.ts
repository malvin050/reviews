export const getLocalStorageItem = (key: string) => {
  const LocalStorageItemString = localStorage.getItem(key);
  try {
    return LocalStorageItemString && JSON.parse(LocalStorageItemString);
  } catch (e) {
    console.error(`${key} storage is invalid, error: `, e);
  }
};

export const setLocalStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting ${key} in localStorage`, e);
  }
};

export const removeLocalStorageItem = (key: string) => localStorage.removeItem(key);
