
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { motionEvents, type MotionEvent } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EventList() {
  const [events, setEvents] = useState<MotionEvent[]>(motionEvents);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Camera</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.cameraName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={event.thumbnailUrl}
                        alt="Event thumbnail"
                        width={120}
                        height={80}
                        className="hidden rounded-md object-cover sm:block"
                        data-ai-hint="motion detection"
                      />
                      <div>
                        <p className="font-medium">{event.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
