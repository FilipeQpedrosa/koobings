"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from 'next-auth/react';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function StaffClientsPage() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.businessId) {
      fetchClients();
    }
  }, [session]);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/staff/clients", {
        headers: {
          'x-business': session?.user?.businessId || '',
        },
      });
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Clientes
        </h1>
        <Link href="/staff/clients/new">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Cliente
          </Button>
        </Link>
      </header>
      
      <main>
        <Input
          placeholder="Buscar clientes por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full"
        />
        
        {loading ? (
          <div className="text-center py-12">Carregando clientes...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? "Tente ajustar sua busca." : "Comece adicionando um novo cliente."}
            </p>
            <Link href="/staff/clients/new" className="mt-4 inline-block">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Cliente
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filtered.map((client) => (
                <li key={client.id}>
                  <Link href={`/staff/clients/${client.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">{client.name}</p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {client.email || "Sem email"}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {client.phone || "Sem telefone"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
} 