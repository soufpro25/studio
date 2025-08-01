
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Video, Loader2 } from 'lucide-react';
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
  rtspUrl: z.string().url('Must be a valid URL').startsWith('rtsp://', 'URL must start with rtsp://'),
});

export function AddCameraDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [cameras, setCameras] = useAtom(camerasAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', location: '', rtspUrl: 'rtsp://' },
    mode: 'onChange'
  });

  const rtspUrlValue = useWatch({ control: form.control, name: 'rtspUrl' });
  const isUrlValid = formSchema.shape.rtspUrl.safeParse(rtspUrlValue).success;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const newCameraId = `cam-${Date.now()}`;
    const newCamera: Camera = {
        id: newCameraId,
        ...values,
        status: 'Online', // Assume online initially
        thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff', // Placeholder
        // The actual streamUrl will be based on the go2rtc config
        streamUrl: `/api/placeholder`, 
    };

    try {
        const response = await fetch('/api/cameras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newCameraId,
                name: values.name,
                rtspUrl: values.rtspUrl
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to configure camera on server');
        }

        // Add to UI state only after successful API call
        setCameras((prev) => [...prev, newCamera]);

        toast({
          title: 'Camera Added',
          description: `The camera "${values.name}" has been added and go2rtc is restarting.`,
        });
        setOpen(false);
        form.reset();

    } catch (error: any) {
        console.error(error);
        toast({
            title: 'Error Adding Camera',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New Camera</DialogTitle>
          <DialogDescription>
            Enter the camera details. This will automatically update the go2rtc configuration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                name="rtspUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>RTSP Stream URL</FormLabel>
                    <FormControl>
                        <Input placeholder="rtsp://user:pass@192.168.1.100:554/stream1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <div className='space-y-2'>
                    <FormLabel>Live Preview</FormLabel>
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden border">
                       <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 p-4 text-center">
                            <Video className="h-8 w-8" />
                            <p className="text-sm">A live preview is not available here.</p>
                            <p className="text-xs">The stream will be available on the dashboard after go2rtc restarts.</p>
                        </div>
                    </AspectRatio>
                </div>
                
                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Camera
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
