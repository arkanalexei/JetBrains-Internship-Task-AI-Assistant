import { atom } from 'recoil';

export const loadingChat = atom<boolean>({
  key: 'loadingChat',
  default: false,
});