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
            Agendar Serviços
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/customer/appointments">
                  <Button variant="ghost">Meus Agendamentos</Button>
                </Link>
                <Link href="/auth/signout">
                  <Button variant="outline">Sair</Button>
                </Link>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline">Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 