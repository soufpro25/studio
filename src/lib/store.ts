
'use client';

import { atom } from 'jotai';
import { initialCameras } from './data';
import type { Camera } from './data';

export const camerasAtom = atom<Camera[]>(initialCameras);
