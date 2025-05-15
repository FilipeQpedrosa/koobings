import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-8 sm:px-0">
        {children}
      </div>
    </div>
  );
} 