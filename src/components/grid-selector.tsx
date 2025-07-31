
'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface GridSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: number;
  cols: number;
  onCellClick?: (index: number) => void;
  children: React.ReactNode;
}

export function GridSelector({
  rows,
  cols,
  onCellClick,
  children,
  className,
  ...props
}: GridSelectorProps) {

  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  };

  const cells = React.Children.toArray(children);

  return (
    <div
      className={cn("grid w-full gap-2", className)}
      style={gridStyle}
      {...props}
    >
      {Array.from({ length: rows * cols }).map((_, index) => (
        <button
          key={index}
          onClick={() => onCellClick?.(index)}
          className={cn(
            "flex aspect-square items-center justify-center rounded-md border bg-background text-foreground transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          disabled={!onCellClick || !cells[index]}
        >
          {cells[index] || null}
        </button>
      ))}
    </div>
  );
}
