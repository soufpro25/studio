
'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { camerasAtom } from '@/lib/store';
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
  const { toast } = useToast();

  const removeCamera = async (id: string) => {
    // Optimistically update UI
    const originalCameras = cameras;
    setCameras((prev) => prev.filter((c) => c.id !== id));

    try {
      const response = await fetch('/api/cameras', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete camera on server');
      }

      toast({
        title: 'Camera Removed',
        description: 'The camera has been removed from your configuration.',
      });

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to remove the camera. Restoring previous state.',
        variant: 'destructive',
      });
      // Rollback UI on failure
      setCameras(originalCameras);
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
              <div className="rounded-md border p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dashboard Layouts</h3>
                  <p className="text-sm text-muted-foreground">Customize your dashboard grid layouts.</p>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/settings/layouts">
                        <LayoutGrid />
                    </Link>
                 </Button>
              </div>
              <div className="rounded-md border p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage user accounts and permissions.</p>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/settings/users">
                        <Users />
                    </Link>
                 </Button>
              </div>
               <div className="rounded-md border p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">System Control</h3>
                  <p className="text-sm text-muted-foreground">Manage and restart system services.</p>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/settings/system">
                        <Server />
                    </Link>
                 </Button>
              </div>
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
