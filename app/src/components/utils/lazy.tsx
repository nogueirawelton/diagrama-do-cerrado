import { ReactNode } from "react";

interface LazyProps {
  children: ReactNode;
  fallback: ReactNode;
  pending: boolean;
}

export function Lazy({ children, fallback, pending }: LazyProps) {
  if (!pending) {
    return children;
  }

  return fallback;
}
