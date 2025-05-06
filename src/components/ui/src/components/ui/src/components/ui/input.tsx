import * as React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
    
