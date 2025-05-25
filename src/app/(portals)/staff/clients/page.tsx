"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-end mb-4">
        <Link href="/staff/clients/new">
          <Button>Add Client</Button>
        </Link>
      </div>
      <Input
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <div>Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No clients found.</div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {filtered.map((client) => (
            <li key={client.id} className="p-4 hover:bg-gray-50 transition">
              <Link href={`/staff/clients/${client.id}`} className="block">
                <div className="font-medium text-lg">{client.name}</div>
                <div className="text-gray-500 text-sm">
                  {client.email || "No email"} &bull; {client.phone || "No phone"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 