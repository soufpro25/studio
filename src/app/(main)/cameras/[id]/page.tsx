
'use client';

import { notFound } from 'next/navigation';
import { cameras } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Maximize, Video, Camera } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type VideoSource = 'demo' | 'live';

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const camera = cameras.find((c) => c.id === params.id);
  const [videoSource, setVideoSource] = useState<VideoSource>('demo');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support camera access.',
      });
      setHasCameraPermission(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
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
        description: 'Please enable camera permissions in your browser settings to use the live feed.',
      });
    }
  };
  
  // Effect for handling video source changes
  useEffect(() => {
    if (videoSource === 'live') {
      if (hasCameraPermission === null) {
        getCameraPermission();
      } else if(hasCameraPermission && streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    } else { // videoSource === 'demo'
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
       if(videoRef.current) {
          videoRef.current.srcObject = null;
        }
    }
  }, [videoSource]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
       if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  if (!camera) {
    notFound();
  }
  
  const handleSourceChange = (source: VideoSource) => {
    setVideoSource(source);
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
               {videoSource === 'demo' ? (
                 <video 
                   key="demo"
                   src="https://storage.googleapis.com/static.aiforge.dev/videos/security-cam-stock.mp4" 
                   className="h-full w-full object-cover" 
                   autoPlay 
                   muted 
                   playsInline 
                   loop 
                 />
               ) : (
                 <video key="live" ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
               )}
               <div className="absolute right-2 top-2 flex flex-col gap-2">
                 <Button size="icon" variant="ghost" className="bg-black/20 hover:bg-black/50">
                   <Maximize className="h-5 w-5" />
                 </Button>
               </div>
            </AspectRatio>
          </Card>
          {videoSource === 'live' && hasCameraPermission === false && (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to see the live feed. You can still view the demo video.
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
                  <Button variant={videoSource === 'demo' ? 'secondary' : 'outline'} onClick={() => handleSourceChange('demo')}>
                    <Video className="mr-2 h-4 w-4" />
                    Demo
                  </Button>
                  <Button variant={videoSource === 'live' ? 'secondary' : 'outline'} onClick={() => handleSourceChange('live')}>
                     <Camera className="mr-2 h-4 w-4" />
                    Live
                  </Button>
                </div>
              </div>
              <Separator />
               <div>
                <h4 className="mb-2 font-medium">Pan & Tilt</h4>
                <div className="grid grid-cols-3 gap-1">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
