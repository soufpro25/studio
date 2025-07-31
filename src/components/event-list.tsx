
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { filterEvents, type FilterEventsInput } from '@/ai/flows/filter-events';
import { motionEvents, type AnalyzedEvent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function EventList() {
  const [events, setEvents] = useState<AnalyzedEvent[]>(motionEvents);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalyze = () => {
    startTransition(async () => {
      try {
        const eventsToAnalyze = events.filter(event => !event.analysis);
        if (eventsToAnalyze.length === 0) {
            toast({
                title: 'No events to analyze',
                description: 'All events have already been analyzed.',
            });
            return;
        }

        const results = await Promise.all(
          events.map(async (event) => {
            if (event.analysis) return event; // Skip already analyzed
            const input: FilterEventsInput = {
              eventDescription: event.description,
              cameraName: event.cameraName,
            };
            const analysis = await filterEvents(input);
            return { ...event, analysis };
          })
        );
        setEvents(results);
        toast({
          title: 'Analysis Complete',
          description: 'All unanalyzed events have been processed by the AI.',
        });
      } catch (error) {
        console.error('Failed to analyze events:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Could not analyze events. Please try again.',
        });
      }
    });
  };
  
  const handleClearAnalysis = () => {
    setEvents(events.map(e => ({...e, analysis: undefined})));
    toast({
        title: 'Analysis Cleared',
        description: 'AI analysis has been cleared from all events.',
    });
  }

  const hasUnanalyzedEvents = events.some(event => !event.analysis);
  const hasAnalyzedEvents = events.some(event => event.analysis);


  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>All Events</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row">
            {hasUnanalyzedEvents && (
              <Button onClick={handleAnalyze} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Analyze Remaining Events
              </Button>
            )}
            {hasAnalyzedEvents && (
                 <Button onClick={handleClearAnalysis} variant="outline" disabled={isPending}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Analysis
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
            <Alert className="mb-4">
                <Bot className="h-4 w-4" />
                <AlertTitle>AI is analyzing events...</AlertTitle>
                <AlertDescription>This may take a moment. Please wait.</AlertDescription>
            </Alert>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Camera</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
                <TableHead className="w-[150px] text-center">AI Analysis</TableHead>
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
                        {event.analysis && (
                          <p className="text-sm text-muted-foreground">
                            {event.analysis.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-center">
                    {isPending && !event.analysis ? (
                       <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                    ) : event.analysis ? (
                      <Badge variant={event.analysis.isRelevant ? 'default' : 'secondary'}>
                        {event.analysis.isRelevant ? 'Relevant' : 'Irrelevant'}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not analyzed</span>
                    )}
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
