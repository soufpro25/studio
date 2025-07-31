
'use client';

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { initialCameras, initialUsers } from './data';
import type { Camera, User } from './data';
import type { Layout } from 'react-grid-layout';

const storage = createJSONStorage(() => sessionStorage);

// ATOM FOR CAMERAS
export const camerasAtom = atom<Camera[]>(initialCameras);

// ATOM FOR USERS
export const usersAtom = atom<User[]>(initialUsers);


// ATOMS FOR LAYOUTS

// This defines the structure for a single named layout
export interface NamedLayout {
  id: string;
  name: string;
  layout: Layout[];
}

// A default layout to get users started
const defaultLayout: NamedLayout = {
  id: 'default',
  name: 'Default View',
  layout: initialCameras.slice(0, 4).map((cam, i) => ({
    i: cam.id,
    x: (i % 2) * 6,
    y: Math.floor(i / 2) * 4,
    w: 6,
    h: 4,
  })),
};

// This atom stores all the created layouts
export const layoutsAtom = atomWithStorage<NamedLayout[]>('dashboardLayouts', [defaultLayout], storage);

// This atom tracks which layout is currently active on the dashboard
export const activeLayoutIdAtom = atomWithStorage<string | null>('activeLayoutId', 'default', storage);
