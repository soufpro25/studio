import { EventList } from '@/components/event-list';

export default function RecordingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Event Recordings</h1>
        <p className="text-muted-foreground">
          Review motion events from your cameras.
        </p>
      </header>
      <EventList />
    </div>
  );
}
