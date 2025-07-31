import { Bot } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-foreground">AegisView</h1>
    </div>
  );
}
