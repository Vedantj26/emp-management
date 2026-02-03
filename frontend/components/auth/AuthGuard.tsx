"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, isAuthenticated, UserRole } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: readonly ("ADMIN" | "USER")[];
}

export default function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const redirectByRole = (role: UserRole) => {
    return role === "ADMIN" ? "/dashboard" : "/exhibitions";
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    if (allowedRoles) {
      const user = getAuthUser();
      if (!user || !allowedRoles.includes(user.role as "ADMIN" | "USER")) {
        router.replace(redirectByRole(user?.role ?? "USER"));
        return;
      }
    }

    setChecking(false);
  }, [router, allowedRoles]);

  if (checking) return null;

  return <>{children}</>;
}
