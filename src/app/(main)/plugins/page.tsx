import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plug, Search, CheckCircle } from "lucide-react";

const plugins = [
    { name: 'ONVIF Camera', author: 'AegisView Team', version: '1.2.0', description: 'Adds support for modern IP cameras using the ONVIF protocol.', installed: true },
    { name: 'RTSP Camera', author: 'AegisView Team', version: '1.1.0', description: 'Manually configure any camera with an RTSP stream URL.', installed: true },
    { name: 'HomeKit Bridge', author: 'Community', version: '0.9.5', description: 'Exposes your cameras to Apple HomeKit for Siri and Home app integration.', installed: false },
    { name: 'Google Home Bridge', author: 'Community', version: '0.8.1', description: 'Stream your cameras on Google Nest Hubs and Chromecast devices.', installed: false },
    { name: 'Alexa Bridge', author: 'Community', version: '1.0.2', description: 'View your camera feeds on Amazon Echo Show devices.', installed: true },
    { name: 'Motion AI Filter', author: 'AegisView Team', version: '2.0.0', description: 'Advanced AI to reduce false motion alerts from shadows, trees, or animals.', installed: true },
]


export default function PluginsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
        <p className="text-muted-foreground">Extend AegisView with new features and camera support.</p>
      </header>
       <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search plugins..." className="pl-10" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin) => (
          <Card key={plugin.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Plug className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{plugin.name}</CardTitle>
                <CardDescription>v{plugin.version} by {plugin.author}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{plugin.description}</p>
            </CardContent>
            <CardFooter>
              {plugin.installed ? (
                <Button variant="outline" className="w-full" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Installed
                </Button>
              ) : (
                <Button className="w-full">
                  Install
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
