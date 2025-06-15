import Link from 'next/link';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';

interface CustomerNavbarProps {
  session: Session | null;
}

export default function CustomerNavbar({ session }: CustomerNavbarProps) {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <Link href="/customer" className="text-xl font-semibold text-gray-900">
            Book Services
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/customer/appointments">
                  <Button variant="ghost">My Appointments</Button>
                </Link>
                <Link href="/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 