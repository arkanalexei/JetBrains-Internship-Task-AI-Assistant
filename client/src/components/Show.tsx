import React from "react";

interface Props {
  when: boolean;
  fallback?: React.ReactNode;
  children: JSX.Element;
}

export default function Show({ when, fallback, children }: Props) {
  if (!when) return fallback || null;
  return <>{children}</>;
}
