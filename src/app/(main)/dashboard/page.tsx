
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { camerasAtom, layoutAtom } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GridSelector } from '@/components/grid-selector';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const layoutOptions = [
  { value: '2', label: '2x2' },
  { value: '4', label: '4x4' },
  { value: '8', label: '8x8' },
  { value: '16', label: '16x16' },
];

export default function DashboardPage() {
  const [cameras] = useAtom(camerasAtom);
  const [layout, setLayout] = useAtom(layoutAtom);
  const [selectedLayout, setSelectedLayout] = useState(layout.toString());

  const handleLayoutChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setSelectedLayout(value);
    setLayout(newSize);
  };

  const gridCols = `grid-cols-${layout}`;
  const gridStyle = {
    gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`,
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Customize and view your camera feeds.</p>
      </header>

      <Tabs defaultValue="feeds">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feeds">Live Feeds</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        <TabsContent value="feeds" className="py-4">
          {cameras.length > 0 ? (
            <div className="grid gap-4" style={gridStyle}>
              {cameras.slice(0, layout * layout).map((camera) => (
                <Link key={camera.id} href={`/cameras/${camera.id}`} className="group block overflow-hidden transition-all rounded-lg hover:shadow-lg hover:shadow-primary/10">
                  <Card className="h-full border-0 shadow-none group-hover:border-0">
                    <CardHeader className="flex flex-row items-center justify-between p-2">
                      <CardTitle className="truncate text-sm font-medium">{camera.name}</CardTitle>
                      <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={`${camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''} text-xs`}>
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
                          data-ai-hint="security camera footage"
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
        </TabsContent>
        <TabsContent value="layout" className="py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Grid Layout</CardTitle>
                    <p className="text-muted-foreground">Select the grid size for your camera feeds.</p>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selectedLayout} onValueChange={handleLayoutChange} className="flex flex-col space-y-2">
                        {layoutOptions.map(option => (
                             <Label key={option.value} className="flex items-center gap-3 p-3 rounded-md border border-transparent hover:border-border cursor-pointer [&:has([data-state=checked])]:border-primary">
                                <RadioGroupItem value={option.value} id={`r${option.value}`} />
                                <div className="font-semibold">{option.label}</div>
                                <div className="text-muted-foreground">({option.value}x{option.value} grid)</div>
                             </Label>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
