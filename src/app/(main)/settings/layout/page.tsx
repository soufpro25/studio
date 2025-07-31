
'use client';

import { useAtom } from 'jotai';
import { camerasAtom, layoutAtom } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import RGL, { WidthProvider, type Layout } from 'react-grid-layout';

const GridLayout = WidthProvider(RGL);

export default function EditLayoutPage() {
  const [cameras] = useAtom(camerasAtom);
  const [savedLayout, setSavedLayout] = useAtom(layoutAtom);
  const [currentLayout, setCurrentLayout] = useState<Layout[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Ensure savedLayout is an array before processing
    const safeSavedLayout = Array.isArray(savedLayout) ? savedLayout : [];
    
    // Sync the current layout with saved layout, adding any new cameras
    const existingIds = new Set(safeSavedLayout.map(item => item.i));
    const newCameras = cameras.filter(cam => !existingIds.has(cam.id));

    const newItems: Layout[] = newCameras.map((cam, index) => ({
      i: cam.id,
      x: (index * 6) % 12, // Cascade new items
      y: Infinity, // Puts them at the bottom
      w: 6,
      h: 4,
    }));

    setCurrentLayout([...safeSavedLayout, ...newItems]);
  }, [cameras, savedLayout]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setCurrentLayout(newLayout);
  };

  const handleSaveLayout = () => {
    setSavedLayout(currentLayout);
    toast({
      title: 'Layout Saved',
      description: 'Your new dashboard layout has been saved successfully.',
    });
  };

  const handleResetLayout = () => {
     // A simple reset logic: a 2-column grid
     const defaultLayout: Layout[] = cameras.map((cam, i) => ({
        i: cam.id,
        x: (i % 2) * 6,
        y: Math.floor(i / 2) * 4,
        w: 6,
        h: 4,
      }));
      setCurrentLayout(defaultLayout);
       toast({
        title: 'Layout Reset',
        description: 'Layout has been reset to the default.',
        variant: 'default',
      });
  }

  return (
    <div className="flex flex-col gap-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight">Edit Dashboard Layout</h1>
        <p className="text-muted-foreground">Drag, drop, and resize your camera feeds to create a personalized view.</p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Layout Editor</CardTitle>
            <CardDescription>
                Arrange the camera blocks below. The changes will be reflected on your dashboard after you save.
            </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] rounded-lg border-2 border-dashed p-4">
             <GridLayout
                layout={currentLayout}
                onLayoutChange={onLayoutChange}
                cols={12}
                rowHeight={30}
                className="layout"
                >
                {cameras.map((camera) => (
                    <div key={camera.id} className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                         <div className="flex items-center justify-between p-2 border-b">
                            <h3 className="font-medium text-sm truncate">{camera.name}</h3>
                            <div className="h-2 w-2 rounded-full shrink-0" style={{backgroundColor: camera.status === 'Online' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'}}/>
                         </div>
                         <div className="flex-grow bg-muted p-2">
                           <AspectRatio ratio={16/9} className="flex items-center justify-center">
                                <Image src={camera.thumbnailUrl} alt={camera.name} fill className="object-cover" data-ai-hint="security camera" />
                           </AspectRatio>
                         </div>
                    </div>
                ))}
            </GridLayout>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={handleResetLayout}>Reset Layout</Button>
            <Button onClick={handleSaveLayout}>Save Layout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
