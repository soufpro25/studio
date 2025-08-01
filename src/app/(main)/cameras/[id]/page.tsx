
'use client';

import { notFound } from 'next/navigation';
import { useAtom } from 'jotai';
import { camerasAtom } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Maximize, Video, Camera, Sun, Contrast, Wind, Snowflake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState, use, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GridSelector } from '@/components/grid-selector';

type VideoSource = 'demo' | 'live';

export default function CameraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cameras] = useAtom(camerasAtom);

  const camera = useMemo(() => cameras.find((c) => c.id === id), [cameras, id]);
  
  const [videoSource, setVideoSource] = useState<VideoSource>('live');
  const { toast } = useToast();

  if (!camera) {
    // This can happen briefly on first load before Jotai state is synced from sessionStorage
    return null;
  }

  const filters = [
    { icon: Sun, label: 'Bright' },
    { icon: Contrast, label: 'Contrast' },
    { icon: Wind, label: 'Cool' },
    { icon: Snowflake, label: 'Icy' }
  ]

  const isValidHttpUrl = (str: string) => {
    if (!str) return false;
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
  
  const hasLiveFeed = isValidHttpUrl(camera.streamUrl);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{camera.name}</h1>
        <p className="text-muted-foreground">{camera.location}</p>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <AspectRatio ratio={16 / 9} className="relative bg-muted">
              {videoSource === 'live' && hasLiveFeed ? (
                 <iframe
                  src={camera.streamUrl}
                  className="h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={`Live feed from ${camera.name}`}
                ></iframe>
              ) : (
                <video
                  key="demo-video"
                  src="https://storage.googleapis.com/static.aiforge.dev/videos/security-cam-stock.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                />
              )}
              <div className="absolute right-2 top-2 flex flex-col gap-2">
                <Button size="icon" variant="ghost" className="bg-black/20 hover:bg-black/50">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </AspectRatio>
          </Card>
          {videoSource === 'live' && !hasLiveFeed && (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Live Feed Not Available</AlertTitle>
              <AlertDescription>
                A valid stream URL has not been configured for this camera. Please add one in the settings. You are currently viewing the demo video.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Video Source</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={videoSource === 'demo' ? 'secondary' : 'outline'} onClick={() => setVideoSource('demo')}>
                    <Video className="mr-2 h-4 w-4" />
                    Demo
                  </Button>
                  <Button variant={videoSource === 'live' ? 'secondary' : 'outline'} onClick={() => setVideoSource('live')} disabled={!hasLiveFeed}>
                     <Camera className="mr-2 h-4 w-4" />
                    Live
                  </Button>
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="mb-2 font-medium">Pan & Tilt</h4>
                <div className="grid grid-cols-3 justify-items-center gap-1">
                  <div />
                  <Button size="icon" variant="outline"><ArrowUp /></Button>
                  <div />
                  <Button size="icon" variant="outline"><ArrowLeft /></Button>
                  <div />
                  <Button size="icon" variant="outline"><ArrowRight /></Button>
                   <div />
                  <Button size="icon" variant="outline"><ArrowDown /></Button>
                  <div />
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="mb-2 font-medium">Zoom</h4>
                 <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline"><ZoomIn className="mr-2 h-4 w-4" /> Zoom In</Button>
                  <Button variant="outline"><ZoomOut className="mr-2 h-4 w-4"/> Zoom Out</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 font-medium">Filters</h4>
                <GridSelector rows={2} cols={2} onCellClick={(index) => toast({ title: `Filter "${filters[index].label}" selected` })}>
                  {filters.map((filter, i) => (
                    <div key={i} className="flex flex-col items-center justify-center gap-2">
                       <filter.icon className="h-6 w-6" />
                       <span className="text-xs">{filter.label}</span>
                    </div>
                  ))}
                </GridSelector>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
