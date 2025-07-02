"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminBusinessEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", status: "ACTIVE", ownerName: "", allowStaffToViewAllBookings: true });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching business with ID:", id);
        const res = await fetch(`/api/admin/businesses/${id}`);
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.error?.message || "Negócio não encontrado");
        }
        
        const data = await res.json();
        console.log("Received business data:", data);
        
        const businessData = data.data || data;
        setBusiness(businessData);
        
        // Log the specific fields we're trying to populate
        console.log("Business fields:", {
          name: businessData.name,
          email: businessData.email,
          status: businessData.status,
          ownerName: businessData.ownerName,
          allowStaffToViewAllBookings: businessData.allowStaffToViewAllBookings
        });
        
        setForm({
          name: businessData.name || "",
          email: businessData.email || "",
          status: businessData.status || "ACTIVE",
          ownerName: businessData.ownerName || "",
          allowStaffToViewAllBookings: businessData.allowStaffToViewAllBookings !== undefined ? businessData.allowStaffToViewAllBookings : true,
        });
      } catch (err: any) {
        console.error("Error fetching business:", err);
        setError(err.message || "Falha ao carregar negócio");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBusiness();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Falha ao atualizar negócio");
      }
      router.push(`/admin/businesses/${id}`);
    } catch (err: any) {
      setError(err.message || "Falha ao atualizar negócio");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const res = await fetch(`/api/admin/businesses/${id}/owner-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Falha ao atualizar senha");
      }
      setPasswordSuccess("Senha atualizada com sucesso");
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordError(err.message || "Falha ao atualizar senha");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) return <div className="p-8">Carregando negócio...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!business) return <div className="p-8">Negócio não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar Negócio</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nome</label>
          <input className="border rounded p-2 w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input className="border rounded p-2 w-full" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          {!form.email && <div className="text-red-500 text-xs mt-1">Por favor, preencha este campo.</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select className="border rounded p-2 w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Nome do Proprietário</label>
          <input className="border rounded p-2 w-full" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} />
        </div>
        <div>
          <label className="block font-medium mb-1">Restringir funcionários a apenas ver seus próprios agendamentos</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!form.allowStaffToViewAllBookings}
              onChange={e => setForm(f => ({ ...f, allowStaffToViewAllBookings: !e.target.checked }))}
              className="h-4 w-4"
              id="restrict-bookings"
            />
            <label htmlFor="restrict-bookings" className="text-sm">
              Quando ativado, funcionários só poderão ver agendamentos atribuídos a eles. Não poderão ver agendamentos de outros funcionários.
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => router.push(`/admin/businesses/${id}`)} disabled={saving}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(true)} disabled={saving}>Alterar Senha do Proprietário</Button>
        </div>
      </form>
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogTitle>Alterar Senha do Proprietário</DialogTitle>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              className="border rounded p-2 w-full"
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} disabled={passwordSaving}>Cancelar</Button>
              <Button type="submit" disabled={passwordSaving || !newPassword}>{passwordSaving ? "Salvando..." : "Salvar Senha"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 