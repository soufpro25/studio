
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
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
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

export function EventList() {
  const [events, setEvents] = useState<MotionEvent[]>(motionEvents);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const filteredEvents = events.filter((event) => {
    if (!date?.from) return true;
    const eventDate = new Date(event.timestamp);
    if (date.to) {
      return eventDate >= date.from && eventDate <= date.to;
    }
    // If only 'from' is selected, filter for events on that day
    return eventDate >= date.from && eventDate < new Date(date.from.getTime() + 24 * 60 * 60 * 1000);
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>All Events</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
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
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No events found for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
