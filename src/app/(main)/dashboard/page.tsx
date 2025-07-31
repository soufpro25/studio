
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { camerasAtom } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function DashboardPage() {
  const [cameras] = useAtom(camerasAtom);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Live feeds from all your cameras.</p>
      </header>
      {cameras.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cameras.map((camera) => (
            <Link key={camera.id} href={`/cameras/${camera.id}`} className="group block overflow-hidden transition-all rounded-lg hover:shadow-lg hover:shadow-primary/10">
              <Card className="h-full border-0 shadow-none group-hover:border-0">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="truncate text-base font-medium">{camera.name}</CardTitle>
                  <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''}>
                    {camera.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
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
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold">No Cameras Found</h3>
            <p className="text-sm text-muted-foreground">Go to the settings page to add your first camera.</p>
        </div>
      )}
    </div>
  );
}
