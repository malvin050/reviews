export const getSessionStorageItem = (key: string) => {
  const sessionStorageItemString = sessionStorage.getItem(key);
  try {
    return sessionStorageItemString && JSON.parse(sessionStorageItemString);
  } catch (e) {
    console.error(`${key} storage is invalid, error: `, e);
  }
};

export const setSessionStorageItem = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting ${key} in sessionStorage`, e);
  }
};

export const removeSessionStorageItem = (key: string) => sessionStorage.removeItem(key);
