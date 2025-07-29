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
import { Plus, Wifi, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cameras } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  streamUrl: z.string().url('Must be a valid RTSP URL').startsWith('rtsp://'),
  username: z.string().optional(),
  password: z.string().optional(),
});

export function AddCameraDialog() {
  const [open, setOpen] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', streamUrl: 'rtsp://', username: '', password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Camera Added',
      description: `The camera "${values.name}" has been added successfully.`,
    });
    setOpen(false);
    form.reset();
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
      <DialogContent className="sm:max-w-[480px]">
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
             <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center">
                <Wifi className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Discover Cameras</h3>
                <p className="text-sm text-muted-foreground">Find ONVIF-compatible cameras on your local network.</p>
                <Button onClick={handleDiscover} disabled={isDiscovering}>
                    {isDiscovering ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...</> : 'Start Discovery'}
                </Button>
                {!isDiscovering && (
                  <p className="text-xs text-muted-foreground pt-4">Simulated: No cameras found. Try manual entry.</p>
                )}
             </div>
          </TabsContent>
          <TabsContent value="manual">
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
                  name="streamUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream URL</FormLabel>
                      <FormControl>
                        <Input placeholder="rtsp://192.168.1.100/stream" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="(optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="(optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-4">
                    <Button type="submit">Add Camera</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
