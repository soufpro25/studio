
'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { camerasAtom, layoutsAtom, activeLayoutIdAtom } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, LayoutGrid, Users, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddCameraDialog } from '@/components/add-camera-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [cameras, setCameras] = useAtom(camerasAtom);
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const [activeLayoutId] = useAtom(activeLayoutIdAtom);
  const { toast } = useToast();

  const removeCamera = async (id: string) => {
    const originalCameras = cameras;
    const originalLayouts = layouts;
    
    // Optimistically update UI
    setCameras((prev) => prev.filter((c) => c.id !== id));
    // Remove camera from all layouts
    setLayouts((prevLayouts) => 
        prevLayouts.map(layout => ({
            ...layout,
            layout: layout.layout.filter(item => item.i !== id)
        }))
    );


    try {
      const response = await fetch('/api/cameras', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete camera on server');
      }

      toast({
        title: 'Camera Removed',
        description: 'The camera has been removed from your configuration and all layouts.',
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to remove the camera. Restoring previous state.',
        variant: 'destructive',
      });
      // Rollback UI on failure
      setCameras(originalCameras);
      setLayouts(originalLayouts);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your cameras and system configuration.</p>
      </header>

      <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
            <CardDescription>Manage general system settings and configurations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/settings/layouts" className="rounded-md border p-4 flex items-center justify-between hover:bg-accent transition-colors">
                <div>
                  <h3 className="font-medium flex items-center gap-2"><LayoutGrid className="h-5 w-5" />Dashboard Layouts</h3>
                  <p className="text-sm text-muted-foreground mt-1">Customize your dashboard grid layouts.</p>
                </div>
              </Link>
              <Link href="/settings/users" className="rounded-md border p-4 flex items-center justify-between hover:bg-accent transition-colors">
                <div>
                  <h3 className="font-medium flex items-center gap-2"><Users className="h-5 w-5" />User Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage user accounts and permissions.</p>
                </div>
              </Link>
               <Link href="/settings/system" className="rounded-md border p-4 flex items-center justify-between hover:bg-accent transition-colors">
                <div>
                  <h3 className="font-medium flex items-center gap-2"><Server className="h-5 w-5" />System Control</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage and restart system services.</p>
                </div>
              </Link>
          </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Your Cameras</CardTitle>
            <CardDescription>A list of all cameras connected to the system.</CardDescription>
          </div>
          <AddCameraDialog />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RTSP Stream</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cameras.length > 0 ? (
                  cameras.map((camera) => (
                    <TableRow key={camera.id}>
                      <TableCell className="font-medium">{camera.name}</TableCell>
                      <TableCell>{camera.location}</TableCell>
                      <TableCell>
                         <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''}>
                          {camera.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{camera.rtspUrl}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                             <DropdownMenuItem onClick={() => removeCamera(camera.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No cameras configured.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
