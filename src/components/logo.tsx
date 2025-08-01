
'use client';

import { Cctv } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function Logo() {
  const { state } = useSidebar();
  
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
        <Cctv className="h-6 w-6 text-primary" />
      </div>
      <h1 
        className={cn(
          "text-xl font-bold text-foreground transition-[margin,opacity] duration-300 ease-in-out",
          "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-ml-8"
          )}
      >
        AegisView
      </h1>
    </div>
  );
}
