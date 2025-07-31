
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
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
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function EventList() {
  const [events, setEvents] = useState<MotionEvent[]>(motionEvents);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.timestamp);
    
    if (date?.from) {
      const fromDate = new Date(date.from);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      fromDate.setHours(startHour, startMinute, 0, 0);

      let toDate: Date;
      if (date.to) {
        toDate = new Date(date.to);
      } else {
        // if no 'to' date, use the 'from' date
        toDate = new Date(date.from);
      }
      const [endHour, endMinute] = endTime.split(':').map(Number);
      toDate.setHours(endHour, endMinute, 59, 999);
      
      if (eventDate < fromDate || eventDate > toDate) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Events</CardTitle>
        <div className="flex items-center gap-4">
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
             <div className="flex items-center gap-2">
                <Label htmlFor="start-time" className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    From
                </Label>
                <Input 
                    id="start-time" 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-[120px]"
                />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="end-time" className="flex items-center gap-1 text-muted-foreground">
                    To
                </Label>
                <Input 
                    id="end-time" 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-[120px]"
                />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Camera</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-[170px]">Time</TableHead>
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
                    <TableCell className="text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{format(new Date(event.timestamp), 'MMM d, yyyy')}</span>
                        <span className="font-mono text-sm">{format(new Date(event.timestamp), 'HH:mm:ss')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No events found for the selected date and time range.
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
