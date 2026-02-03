'use client';

import React from "react"
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AuthGuard from "../auth/AuthGuard";
import { usePathname } from "next/navigation";
import { ROUTE_ROLES } from "@/lib/routeRoles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const routeKey = pathname.split("/")[1] as keyof typeof ROUTE_ROLES;

  const allowedRoles = ROUTE_ROLES[routeKey];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AuthGuard allowedRoles={allowedRoles}>
        <Topbar />
        <Sidebar />
        <main className="pt-16 md:pt-16 md:pl-64 w-full overflow-x-hidden">
          <div className="px-3 md:px-8 py-4 md:py-8 w-full">
            {children}
          </div>
        </main>
      </AuthGuard>
    </div>
  );
}
