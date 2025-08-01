

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline';
  thumbnailUrl: string;
  streamUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Viewer';
  avatarUrl: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  installed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MotionEvent {
  id: string;
  timestamp: string;
  cameraName: string;
  cameraId: string;
  description: string;
  thumbnailUrl: string;
}

export type AnalyzedEvent = MotionEvent;

export const initialCameras: Camera[] = [
  {
    id: 'cam-001',
    name: 'Front Door',
    location: 'Entrance',
    status: 'Online',
    thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff',
    streamUrl: 'http://localhost:1984/stream.html?src=front_door',
  },
  {
    id: 'cam-002',
    name: 'Backyard',
    location: 'Exterior',
    status: 'Online',
    thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff',
    streamUrl: 'http://localhost:1984/stream.html?src=backyard',
  },
  {
    id: 'cam-003',
    name: 'Living Room',
    location: 'Interior',
    status: 'Offline',
    thumbnailUrl: 'https://placehold.co/600x400/7f8c8d/ffffff',
    streamUrl: '',
  },
  {
    id: 'cam-004',
    name: 'Garage',
    location: 'Exterior',
    status: 'Online',
    thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff',
    streamUrl: '',
  },
];

export const initialUsers: User[] = [
    {
        id: 'user-001',
        name: 'Admin',
        email: 'admin@aegis.view',
        role: 'Admin',
        avatarUrl: 'https://placehold.co/100x100'
    },
    {
        id: 'user-002',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'Viewer',
        avatarUrl: 'https://placehold.co/100x100'
    },
     {
        id: 'user-003',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        role: 'Viewer',
        avatarUrl: 'https://placehold.co/100x100'
    }
]

export const motionEvents: AnalyzedEvent[] = [
  {
    id: 'evt-001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    cameraName: 'Front Door',
    cameraId: 'cam-001',
    description: 'A person was detected approaching the front door.',
    thumbnailUrl: 'https://placehold.co/120x80',
  },
  {
    id: 'evt-002',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    cameraName: 'Backyard',
    cameraId: 'cam-002',
    description: 'Tree branches swaying in the wind.',
    thumbnailUrl: 'https://placehold.co/120x80',
  },
  {
    id: 'evt-003',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    cameraName: 'Garage',
    cameraId: 'cam-004',
    description: 'Car detected pulling into the garage.',
    thumbnailUrl: 'https://placehold.co/120x80',
  },
  {
    id: 'evt-004',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    cameraName: 'Backyard',
    cameraId: 'cam-002',
    description: 'A cat is walking across the lawn.',
    thumbnailUrl: 'https://placehold.co/120x80',
  },
  {
    id: 'evt-005',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    cameraName: 'Front Door',
    cameraId: 'cam-001',
    description: 'Mail carrier dropped off a package.',
    thumbnailUrl: 'https://placehold.co/120x80',
  },
];
