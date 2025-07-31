
'use client';

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { initialCameras } from './data';
import type { Camera } from './data';
import type { Layout } from 'react-grid-layout';

const storage = createJSONStorage(() => sessionStorage);

export const camerasAtom = atom<Camera[]>(initialCameras);

// Default layout: a 2x2 grid for the first 4 cameras
const defaultLayout: Layout[] = initialCameras.slice(0, 4).map((cam, i) => ({
  i: cam.id,
  x: (i % 2) * 6,
  y: Math.floor(i / 2) * 4,
  w: 6,
  h: 4,
}));


export const layoutAtom = atomWithStorage<Layout[]>('dashboardLayout', defaultLayout, storage);
