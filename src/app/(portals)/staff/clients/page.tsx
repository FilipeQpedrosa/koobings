"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function StaffClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/staff/clients");
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
    <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link href="/staff/clients/new">
          <Button size="icon" className="sm:hidden" aria-label="Add Client">
            <Plus className="h-5 w-5" />
          </Button>
          <Button className="hidden sm:inline-flex" aria-label="Add Client">
            <Plus className="h-5 w-5 mr-2" /> Add Client
          </Button>
        </Link>
      </div>
      <Input
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full"
      />
      {loading ? (
        <div className="text-center py-8">Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No clients found.</div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {filtered.map((client) => (
            <li key={client.id} className="p-4 hover:bg-gray-50 transition cursor-pointer">
              <Link href={`/staff/clients/${client.id}`} className="block">
                <div className="font-medium text-lg mb-1">{client.name}</div>
                <div className="text-gray-500 text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>{client.email || "No email"}</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>{client.phone || "No phone"}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 