import { atomWithSecureStorage } from '@/utils/atomWithSecureStorage';

export type Tokens = {
  accessToken: string
  refreshToken: string
  service: "credit-agricole"
};

export const tokens = atomWithSecureStorage<Tokens>('tokens');
