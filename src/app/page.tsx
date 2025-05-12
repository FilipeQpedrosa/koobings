import Link from 'next/link';
import { Calendar, Users, Clock, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">Service Scheduler</div>
          <div>
            <Link
              href="/auth/signin"
              className="text-indigo-600 hover:text-indigo-900"
            >
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <main>
        <div className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-800 mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">
                    Gerencie sua agenda de forma
                  </span>
                  <span className="block text-indigo-200">simples e eficiente</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                  Ideal para cabeleireiros, barbeiros, manicures, fisioterapeutas,
                  psicólogos e outros profissionais de serviços.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                    >
                      Começar Agora
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
          <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="relative">
              <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Uma solução completa para seu negócio
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                Tudo que você precisa para gerenciar seus agendamentos e clientes
                em um só lugar.
              </p>
            </div>

            <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Funcionalidades principais
                </h3>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Agenda Online
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Gerencie seus horários de forma eficiente e permita que seus
                      clientes agendem online.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Gestão de Clientes
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Mantenha um histórico completo dos seus clientes e serviços
                      prestados.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Clock className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Horários Flexíveis
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Configure seus horários de trabalho e disponibilidade de
                      forma personalizada.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Shield className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Segurança
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Seus dados e de seus clientes protegidos com os mais altos
                      padrões de segurança.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0">
                <div className="relative space-y-4">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Service Scheduler. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
