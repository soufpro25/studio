
'use client';

import { useAtom } from 'jotai';
import { camerasAtom, layoutsAtom, activeLayoutIdAtom } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import RGL, { WidthProvider, type Layout } from 'react-grid-layout';
import type { NamedLayout } from '@/lib/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Copy, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const GridLayout = WidthProvider(RGL);

export default function ManageLayoutsPage() {
  const [cameras] = useAtom(camerasAtom);
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const [activeLayoutId, setActiveLayoutId] = useAtom(activeLayoutIdAtom);
  
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(activeLayoutId);
  const [currentLayout, setCurrentLayout] = useState<Layout[]>([]);
  const [layoutName, setLayoutName] = useState('');
  
  const { toast } = useToast();

  const selectedLayout = useMemo(() => {
    return layouts.find(l => l.id === selectedLayoutId) || null;
  }, [layouts, selectedLayoutId]);

  useEffect(() => {
    if (selectedLayout) {
      // Ensure layout is an array before proceeding
      const savedLayoutItems = Array.isArray(selectedLayout.layout) ? selectedLayout.layout : [];
      
      const layoutCameras = new Set(savedLayoutItems.map(item => item.i));
      const newCameras = cameras.filter(cam => !layoutCameras.has(cam.id));
      
      const newItems: Layout[] = newCameras.map((cam, index) => ({
        i: cam.id,
        x: ((savedLayoutItems.length + index) * 6) % 12,
        y: Infinity, // This places new items at the bottom
        w: 6,
        h: 4,
      }));
      
      setCurrentLayout([...savedLayoutItems, ...newItems]);
      setLayoutName(selectedLayout.name);
    } else {
      setCurrentLayout([]);
      setLayoutName('');
    }
  }, [selectedLayout, cameras]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setCurrentLayout(newLayout);
  };

  const handleRemoveFromLayout = (cameraId: string) => {
    setCurrentLayout(prev => prev.filter(item => item.i !== cameraId));
    toast({ title: "Camera removed from layout."});
  }
  
  const handleCreateNewLayout = () => {
    const newId = `layout-${Date.now()}`;
    const newLayout: NamedLayout = {
      id: newId,
      name: 'New Layout',
      layout: [],
    };
    setLayouts(prev => [...prev, newLayout]);
    setSelectedLayoutId(newId);
    setActiveLayoutId(newId);
  };
  
  const handleDuplicateLayout = () => {
    if (!selectedLayout) return;
    const newId = `layout-${Date.now()}`;
    const newLayout: NamedLayout = {
      ...selectedLayout,
      id: newId,
      name: `${selectedLayout.name} (Copy)`,
    };
    setLayouts(prev => [...prev, newLayout]);
    setSelectedLayoutId(newId);
    toast({ title: 'Layout Duplicated' });
  };
  
  const handleDeleteLayout = () => {
    if (!selectedLayout || layouts.length <= 1) {
      toast({ title: 'Cannot delete the last layout', variant: 'destructive'});
      return;
    };
    
    setLayouts(prev => prev.filter(l => l.id !== selectedLayout.id));
    const newSelectedId = layouts[0]?.id || null;
    setSelectedLayoutId(newSelectedId);
    if(activeLayoutId === selectedLayout.id) {
        setActiveLayoutId(newSelectedId);
    }
    toast({ title: 'Layout Deleted' });
  };

  const handleSaveLayout = () => {
    if (!selectedLayout) return;

    // Filter out layout items for cameras that no longer exist
    const cameraIds = new Set(cameras.map(c => c.id));
    const cleanedLayout = currentLayout.filter(item => cameraIds.has(item.i));

    const updatedLayout: NamedLayout = {
      ...selectedLayout,
      name: layoutName,
      layout: cleanedLayout,
    };
    
    setLayouts(prev => prev.map(l => l.id === selectedLayout.id ? updatedLayout : l));
    
    toast({
      title: 'Layout Saved',
      description: `"${layoutName}" has been saved successfully.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight">Manage Dashboard Layouts</h1>
        <p className="text-muted-foreground">Create, customize, and switch between different dashboard views.</p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Layout Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCreateNewLayout}>
                <Plus className="mr-2 h-4 w-4" /> New
              </Button>
            </div>
          </div>
          <CardDescription>
              Select a layout to edit, or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedLayoutId || ''} onValueChange={setSelectedLayoutId}>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Select a layout..." />
                </SelectTrigger>
                <SelectContent>
                  {layouts.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {selectedLayout && (
                <Input 
                  className="md:col-span-2"
                  value={layoutName} 
                  onChange={(e) => setLayoutName(e.target.value)} 
                  placeholder="Layout Name"
                />
              )}
          </div>

          {selectedLayout && (
            <>
              <div className="min-h-[400px] rounded-lg border-2 border-dashed p-4">
                  <GridLayout
                      layout={currentLayout}
                      onLayoutChange={onLayoutChange}
                      cols={12}
                      rowHeight={30}
                      className="layout"
                      >
                      {currentLayout.map(item => {
                        const camera = cameras.find(c => c.id === item.i);
                        return (
                          <div key={item.i} className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                              {camera ? (
                                <>
                                  <div className="relative flex items-center justify-between p-2 border-b cursor-move">
                                      <h3 className="font-medium text-sm truncate">{camera.name}</h3>
                                      <div className="h-2 w-2 rounded-full shrink-0" style={{backgroundColor: camera.status === 'Online' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'}}/>
                                       <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveFromLayout(camera.id)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  <div className="flex-grow bg-muted p-2">
                                    <AspectRatio ratio={16/9} className="flex items-center justify-center">
                                        <Image src={camera.thumbnailUrl} alt={camera.name} fill className="object-cover" data-ai-hint="security camera" />
                                    </AspectRatio>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center justify-center h-full bg-muted-foreground/10 text-muted-foreground text-sm">
                                  Camera not found
                                </div>
                              )}
                          </div>
                        )
                      })}
                  </GridLayout>
              </div>
               <div className="flex justify-between items-center">
                  <div>
                    <Button variant="outline" size="sm" onClick={handleDuplicateLayout} disabled={!selectedLayout}>
                      <Copy className="mr-2 h-4 w-4"/> Duplicate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm" disabled={!selectedLayout || layouts.length <= 1}>
                           <Trash2 className="mr-2 h-4 w-4"/> Delete
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the "{layoutName}" layout.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteLayout} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={handleSaveLayout} disabled={!selectedLayout}>Save Layout</Button>
                  </div>
              </div>
            </>
          )}

          {!selectedLayout && (
            <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border-2 border-dashed p-12 text-center">
                <h3 className="text-lg font-semibold">No Layout Selected</h3>
                <p className="text-sm text-muted-foreground">Choose a layout from the dropdown or create a new one to begin.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
