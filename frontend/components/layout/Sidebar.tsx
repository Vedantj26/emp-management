'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Presentation, Package, Users, UserCheck, Users2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getAuthUser } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";

const navItems: {
  href: string;
  label: string;
  icon: any;
  roles: UserRole[];
}[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN"],
    },
    {
      href: "/exhibitions",
      label: "Exhibitions",
      icon: Presentation,
      roles: ["ADMIN", "USER"],
    },
    {
      href: "/products",
      label: "Products",
      icon: Package,
      roles: ["ADMIN"],
    },
    {
      href: "/visitors",
      label: "Visitors",
      icon: Users,
      roles: ["ADMIN", "USER"],
    },
    {
      href: "/users",
      label: "Users",
      icon: UserCheck,
      roles: ["ADMIN"],
    },
  ];

export default function Sidebar() {
  const user = getAuthUser();
  const role = user?.role;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-40 pt-16 md:pt-0 ${isOpen ? 'translate-x-0 w-56' : '-translate-x-full w-56'
          } md:translate-x-0 md:w-56 flex flex-col`}
      >
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems
            .filter(item => role && item.roles.includes(role))
            .map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                </Link>
              );
            })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <div className="text-xs text-gray-500 text-center py-2">
            © 2026 Tech Expo
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
