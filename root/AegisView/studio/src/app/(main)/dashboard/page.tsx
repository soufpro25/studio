
'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { camerasAtom, layoutsAtom, activeLayoutIdAtom } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Plus, Settings, VideoOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMemo } from 'react';

const GridLayout = WidthProvider(RGL);


export default function DashboardPage() {
  const [cameras] = useAtom(camerasAtom);
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const [activeLayoutId, setActiveLayoutId] = useAtom(activeLayoutIdAtom);

  const activeLayout = useMemo(() => {
    return layouts.find(l => l.id === activeLayoutId)?.layout || [];
  }, [layouts, activeLayoutId]);

  const safeLayout = useMemo(() => Array.isArray(activeLayout) ? activeLayout : [], [activeLayout]);
  
  const cameraMap = useMemo(() => new Map(cameras.map(cam => [cam.id, cam])), [cameras]);
  
  const isValidHttpUrl = (str: string | undefined) => {
    if (!str) return false;
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
           <p className="text-muted-foreground">
            {layouts.find(l => l.id === activeLayoutId)?.name || 'Select a layout'}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <LayoutGrid className="mr-2" />
                  <span>Change Layout</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuRadioGroup value={activeLayoutId || ''} onValueChange={setActiveLayoutId}>
                  {layouts.map((layout) => (
                    <DropdownMenuRadioItem key={layout.id} value={layout.id}>
                      {layout.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/settings/layouts">
                    <Settings className="mr-2" />
                    Manage Layouts
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
       {cameras.length > 0 && activeLayoutId ? (
          <GridLayout
            className="layout"
            layout={safeLayout}
            onLayoutChange={(newLayout) => {
               setLayouts(currentLayouts =>
                  currentLayouts.map(l =>
                    l.id === activeLayoutId ? { ...l, layout: newLayout } : l
                  )
                );
            }}
            cols={12}
            rowHeight={30}
            isDraggable={true}
            isResizable={true}
          >
            {safeLayout.map((item) => {
                const camera = cameraMap.get(item.i);
                if (!camera) return null;

                const hasLiveFeed = isValidHttpUrl(camera.streamUrl);

                return (
                  <div key={camera.id} className="group overflow-hidden rounded-lg bg-card shadow-sm">
                      <Card className="flex h-full w-full flex-col border-0 shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between p-2 cursor-move">
                          <CardTitle className="truncate text-sm font-medium">
                            <Link href={`/cameras/${camera.id}`} className="hover:underline">
                                {camera.name}
                            </Link>
                          </CardTitle>
                          <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={`${camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''} text-xs`}>
                            {camera.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="flex-grow p-0">
                          <AspectRatio ratio={16 / 9} className="h-full bg-muted">
                              {hasLiveFeed ? (
                                <iframe
                                  src={camera.streamUrl}
                                  className="h-full w-full border-0"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen={false}
                                  title={`Live feed from ${camera.name}`}
                                ></iframe>
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
                                    <VideoOff className="h-8 w-8" />
                                    <p className="mt-2 text-sm">No valid stream URL</p>
                                </div>
                              )}
                          </AspectRatio>
                        </CardContent>
                      </Card>
                  </div>
                )
            })}
          </GridLayout>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
              <h3 className="text-lg font-semibold">{activeLayoutId ? 'No Cameras In Layout' : 'No Layout Selected'}</h3>
              <p className="text-sm text-muted-foreground">
                {activeLayoutId ? 'Edit the layout to add cameras, or add a new camera.' : 'Choose a layout from the dropdown to get started.'}
              </p>
               <Button asChild className="mt-4">
                  <Link href="/settings/layouts">
                    <Plus className="mr-2" />
                    Create or Edit a Layout
                  </Link>
                </Button>
          </div>
        )}
    </div>
  );
}
