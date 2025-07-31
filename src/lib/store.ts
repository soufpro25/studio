
'use client';

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { initialCameras } from './data';
import type { Camera } from './data';

const storage = createJSONStorage(() => sessionStorage);

export const camerasAtom = atom<Camera[]>(initialCameras);
export const layoutAtom = atomWithStorage('dashboardLayout', 4, storage);
