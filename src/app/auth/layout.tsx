import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
} 