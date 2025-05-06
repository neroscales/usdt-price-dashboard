import * as React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow p-4">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
           }
