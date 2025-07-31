
'use client';

import { notFound } from 'next/navigation';
import { cameras } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const camera = cameras.find((c) => c.id === params.id);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
         toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

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
               <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
               <Button size="icon" variant="ghost" className="absolute right-2 top-2 bg-black/20 hover:bg-black/50">
                <Maximize className="h-5 w-5" />
              </Button>
            </AspectRatio>
          </Card>
          {!hasCameraPermission && (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to see the live feed.
              </AlertDescription>
            </Alert>
          )}
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
