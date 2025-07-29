import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cameras } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const camera = cameras.find((c) => c.id === params.id);

  if (!camera) {
    notFound();
  }

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
              <Image
                src={camera.streamUrl.replace('rtsp://aegis.view/stream', 'https://placehold.co/1280x720/2c3e50/ffffff?text=Stream+from+')}
                alt={`Live feed from ${camera.name}`}
                fill
                className="object-cover"
                data-ai-hint="security camera view"
              />
              <Button size="icon" variant="ghost" className="absolute right-2 top-2 bg-black/20 hover:bg-black/50">
                <Maximize className="h-5 w-5" />
              </Button>
            </AspectRatio>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <p>Timeline visualization placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3 className="mb-2 font-medium">Pan & Tilt</h3>
                <div className="grid grid-cols-3 grid-rows-3 gap-2 [&>button]:aspect-square">
                  <div />
                  <Button variant="outline" size="icon"><ArrowUp /></Button>
                  <div />
                  <Button variant="outline" size="icon"><ArrowLeft /></Button>
                  <div />
                  <Button variant="outline" size="icon"><ArrowRight /></Button>
                  <div />
                  <Button variant="outline" size="icon"><ArrowDown /></Button>
                  <div />
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-medium">Zoom</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1"><ZoomIn /></Button>
                  <Button variant="outline" size="icon" className="flex-1"><ZoomOut /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
