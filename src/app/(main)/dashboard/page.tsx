import Link from 'next/link';
import Image from 'next/image';
import { cameras } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Live feeds from all your cameras.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
            <Link href={`/cameras/${camera.id}`}>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="truncate text-base font-medium">{camera.name}</CardTitle>
                <Badge variant={camera.status === 'Online' ? 'outline' : 'destructive'} className={camera.status === 'Online' ? 'border-green-400/50 text-green-400' : ''}>
                  {camera.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Image
                    src={camera.thumbnailUrl}
                    alt={`Live feed from ${camera.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="security camera footage"
                  />
                </AspectRatio>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
