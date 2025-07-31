
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { camerasAtom, layoutAtom } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import RGL, { WidthProvider } from 'react-grid-layout';

const GridLayout = WidthProvider(RGL);


export default function DashboardPage() {
  const [cameras] = useAtom(camerasAtom);
  const [layout, setLayout] = useAtom(layoutAtom);

  // Ensure layout is an array before filtering
  const safeLayout = Array.isArray(layout) ? layout : [];
  
  // Filter out cameras that are not in the layout
  const camerasInLayout = cameras.filter(cam => safeLayout.some(l => l.i === cam.id));

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your customized camera feed layout.</p>
      </header>
       {cameras.length > 0 ? (
          <GridLayout
            className="layout"
            layout={safeLayout}
            cols={12}
            rowHeight={30}
            isDraggable={false}
            isResizable={false}
          >
            {camerasInLayout.map((camera) => (
              <div key={camera.id} className="group overflow-hidden rounded-lg bg-card shadow-sm">
                <Link href={`/cameras/${camera.id}`} className="block h-full w-full">
                    <Card className="flex h-full w-full flex-col border-0 shadow-none">
                      <CardHeader className="flex flex-row items-center justify-between p-2">
                        <CardTitle className="truncate text-sm font-medium">{camera.name}</CardTitle>
                        <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={`${camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''} text-xs`}>
                          {camera.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex-grow p-0">
                        <AspectRatio ratio={16 / 9} className="h-full bg-muted">
                          <Image
                            src={camera.thumbnailUrl}
                            alt={`Live feed from ${camera.name}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="security camera"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                </Link>
              </div>
            ))}
          </GridLayout>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
              <h3 className="text-lg font-semibold">No Cameras Found</h3>
              <p className="text-sm text-muted-foreground">Go to the settings page to add your first camera.</p>
          </div>
        )}
    </div>
  );
}
