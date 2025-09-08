// src/routes/AccessGuard.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

type Mode = "guest" | "protected";

type GuardProps = {
  children: ReactNode;
  mode: Mode; // "guest" or "protected"
  redirectTo?: string; // optional override
};

const DEFAULT_REDIRECT: Record<Mode, string> = {
  guest: "/profile", // if logged in, bounce away from guest pages
  protected: "/login", // if not logged in, go to login
};

export default function AccessGuard({
  children,
  mode,
  redirectTo,
}: GuardProps) {
  const { user } = useUser();
  const location = useLocation();

  const allow = mode === "guest" ? !user : !!user;
  const to = redirectTo ?? DEFAULT_REDIRECT[mode];

  if (!allow) {
    return <Navigate to={to} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
