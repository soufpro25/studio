
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Server, Smartphone } from 'lucide-react';

type ServiceName = 'go2rtc' | 'webapp';

export default function SystemPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<ServiceName | null>(null);

  const handleRestart = async (service: ServiceName) => {
    setLoading(service);
    try {
      const response = await fetch(`/api/system/restart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to restart ${service}`);
      }
      
      toast({
        title: 'Service Restarting',
        description: result.message,
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">System Control</h1>
        <p className="text-muted-foreground">Manage and monitor system services and application state.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <CardDescription>Restart the core services of your AegisView application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className='flex items-center gap-4'>
                <Server className='h-6 w-6' />
                <div>
                    <h3 className="text-base font-medium">go2rtc Media Server</h3>
                    <p className="text-sm text-muted-foreground">Handles camera stream transcoding (RTSP to WebRTC).</p>
                </div>
            </div>
            <Button onClick={() => handleRestart('go2rtc')} disabled={loading === 'go2rtc'} variant="outline">
              {loading === 'go2rtc' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restart go2rtc
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
             <div className='flex items-center gap-4'>
                <Smartphone className='h-6 w-6' />
                <div>
                    <h3 className="text-base font-medium">AegisView Web App</h3>
                    <p className="text-sm text-muted-foreground">The Next.js user interface application.</p>
                </div>
            </div>
            <Button onClick={() => handleRestart('webapp')} disabled={loading === 'webapp'} variant="outline">
               {loading === 'webapp' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restart Web App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
