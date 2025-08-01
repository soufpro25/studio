
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


export function UserMenu() {
    const { state } = useSidebar();
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
            title: `${action} Clicked`,
            description: `This is a placeholder action.`
        })
    }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 p-2">
            <Avatar className="h-7 w-7 border-2 border-primary">
                <AvatarImage src="https://placehold.co/100x100" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={cn(
                "flex flex-col items-start",
                "transition-opacity duration-200",
                "group-data-[state=collapsed]:opacity-0"
            )}>
                <span className="font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">admin@aegis.view</span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" sideOffset={10}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction('Profile')}>
          <User className="mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('Log out')} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
