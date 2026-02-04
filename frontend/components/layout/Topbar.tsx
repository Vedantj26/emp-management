'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, MessageCircle, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuthData } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const exhibitions = [
  'Tech Expo 2026',
  'Art Summit 2026',
  'Innovation Conference 2026',
];

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const showExhibitionDropdown = pathname === '/dashboard';
  const [selectedExhibition, setSelectedExhibition] = useState(exhibitions[0]);

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between z-30 md:left-56 px-4 md:px-6">
      {/* Exhibition Dropdown - Only on dashboard */}
      {showExhibitionDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent hidden md:flex max-w-xs truncate flex-1">
              <span className="truncate">{selectedExhibition}</span>
              <ChevronDown size={16} className="flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {exhibitions.map((exhibition) => (
              <DropdownMenuItem
                key={exhibition}
                onClick={() => setSelectedExhibition(exhibition)}
                className={selectedExhibition === exhibition ? 'bg-blue-50' : ''}
              >
                {exhibition}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Right side icons and menu */}
      <div className="flex items-center justify-end gap-2 md:gap-3 ml-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 p-0">
          <Bell size={16} className="md:w-5 md:h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 md:h-9 md:w-9 p-0">
          <MessageCircle size={16} className="md:w-5 md:h-5" />
        </Button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User size={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
