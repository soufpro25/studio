
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Wifi, Loader2, Video } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { camerasAtom } from '@/lib/store';
import type { Camera } from '@/lib/data';
import { AspectRatio } from './ui/aspect-ratio';

const formSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().min(1, 'Location is required'),
  streamUrl: z.string().url('Must be a valid HTTP/HTTPS URL').startsWith('http', 'URL must start with http:// or https://'),
});

function ManualAddForm({ onFormSubmit }: { onFormSubmit: (values: z.infer<typeof formSchema>) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', location: '', streamUrl: 'http://' },
    mode: 'onChange'
  });

  const streamUrl = useWatch({ control: form.control, name: 'streamUrl' });
  const isUrlValid = formSchema.shape.streamUrl.safeParse(streamUrl).success;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camera Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Front Door" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Entrance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="streamUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://192.168.1.50:1984/stream.html?src=my_cam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-2'>
              <FormLabel>Camera Preview</FormLabel>
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden border">
                {isUrlValid ? (
                     <iframe
                        src={streamUrl}
                        className="h-full w-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="Camera Preview"
                      ></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 p-4 text-center">
                        <Video className="h-8 w-8" />
                        <p className="text-sm">Enter a valid stream URL from your media server to see a preview.</p>
                    </div>
                )}
              </AspectRatio>
              <p className="text-xs text-muted-foreground text-center">Note: Preview requires a running go2rtc or similar media server.</p>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
            <Button type="submit" disabled={!form.formState.isValid}>Add Camera</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function AddCameraDialog() {
  const [open, setOpen] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const { toast } = useToast();
  const [, setCameras] = useAtom(camerasAtom);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCamera: Camera = {
        id: `cam-${Date.now()}`,
        ...values,
        status: Math.random() > 0.2 ? 'Online' : 'Offline',
        thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff'
    };
    setCameras((prev) => [...prev, newCamera]);

    toast({
      title: 'Camera Added',
      description: `The camera "${values.name}" has been added successfully.`,
    });
    setOpen(false);
  }

  function handleDiscover() {
      setIsDiscovering(true);
      setTimeout(() => setIsDiscovering(false), 2500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add a New Camera</DialogTitle>
          <DialogDescription>
            Automatically discover cameras on your network or add one manually.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="discover">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discover">Auto Discover</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="discover" className="py-4">
             <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center min-h-[300px]">
                <Wifi className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Discover Cameras</h3>
                <p className="text-sm text-muted-foreground">Find ONVIF-compatible cameras on your local network.</p>
                <Button onClick={handleDiscover} disabled={isDiscovering}>
                    {isDiscovering ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...</> : 'Start Discovery'}
                </Button>
                {!isDiscovering && (
                  <p className="text-xs text-muted-foreground pt-4">No cameras found. Try manual entry.</p>
                )}
             </div>
          </TabsContent>
          <TabsContent value="manual">
            <ManualAddForm onFormSubmit={onSubmit} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
