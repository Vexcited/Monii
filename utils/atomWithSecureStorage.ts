import * as SecureStore from 'expo-secure-store';
import { atom } from 'jotai';

export const atomWithSecureStorage = <T>(key: string) => {
  const baseAtom = atom<T | null | undefined>(undefined);

  baseAtom.onMount = (setValue) => {
    (async () => {
      const item = await SecureStore.getItemAsync(key);
      setValue(item ? JSON.parse(item) : null);
    })();
  };

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T) => {
      set(baseAtom, update);
      SecureStore.setItemAsync(key, JSON.stringify(update));
    }
  );

  return derivedAtom;
};
