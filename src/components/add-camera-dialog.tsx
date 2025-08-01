
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
import { Plus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { camerasAtom } from '@/lib/store';
import type { Camera } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().min(1, 'Location is required'),
  rtspUrl: z.string().startsWith('rtsp://', 'URL must start with rtsp://'),
});

export function AddCameraDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setCameras] = useAtom(camerasAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', location: '', rtspUrl: 'rtsp://' },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const newCameraId = `cam-${Date.now()}`;
    const streamKey = newCameraId.replace(/[^a-zA-Z0-9]/g, '');

    const newCamera: Camera = {
      id: newCameraId,
      name: values.name,
      location: values.location,
      rtspUrl: values.rtspUrl,
      // The streamUrl is the final go2rtc HTTP stream URL
      streamUrl: `http://192.168.74.129:1984/stream.html?src=${streamKey}`,
      status: 'Online',
      thumbnailUrl: 'https://placehold.co/600x400/2c3e50/ffffff',
    };

    try {
      const response = await fetch('/api/cameras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newCameraId,
          name: values.name,
          rtspUrl: values.rtspUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add camera on the server.');
      }
      
      // Update UI state only on successful API call
      setCameras((prev) => [...prev, newCamera]);

      toast({
        title: 'Camera Added',
        description: `The camera "${values.name}" has been configured.`,
      });
      
      form.reset();
      setOpen(false);

    } catch (error: any) {
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
            Add a camera by providing its RTSP stream URL. This will be automatically added to go2rtc.
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
                    <Input placeholder="rtsp://user:pass@host:port/path" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
