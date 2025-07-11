"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Appointment {
  id: string;
  scheduledFor: string;
  service: { name: string };
  staff: { id: string; name: string };
  notes?: string;
  status: string;
}

interface Note {
  id: string;
  content: string;
  noteType: string;
  createdAt: string;
  createdById: string;
  appointmentId?: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  appointments: Appointment[];
  relationshipNotes: Note[];
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const clientId = params?.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("GENERAL");
  const [appointmentId, setAppointmentId] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState("GENERAL");
  const [editAppointmentId, setEditAppointmentId] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editingClient, setEditingClient] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editClientError, setEditClientError] = useState("");

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    if (client) {
      setEditName(client.name || "");
      setEditEmail(client.email || "");
      setEditPhone(client.phone || "");
    }
  }, [client]);

  async function fetchClient() {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/clients/${clientId}`);
      if (!res.ok) throw new Error("Failed to fetch client");
      const data = await res.json();
      if (data.success) {
        setClient(data.data);
      } else {
        setClient(null);
      }
    } catch {
      setClient(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    setAddingNote(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/clients/${clientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, noteType, appointmentId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add note");
      }
      setNoteContent("");
      setNoteType("GENERAL");
      setAppointmentId("");
      fetchClient();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingNote(false);
    }
  }

  function openEditNote(note: Note) {
    setEditingNote(note);
    setEditContent(note.content);
    setEditType(note.noteType);
    setEditAppointmentId(note.appointmentId || "");
    setEditError("");
  }

  async function handleEditNote(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNote) return;
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/staff/clients/${clientId}/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent, noteType: editType, appointmentId: editAppointmentId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update note");
      }
      setEditingNote(null);
      fetchClient();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleEditClient(e: React.FormEvent) {
    e.preventDefault();
    setEditClientError("");
    try {
      const res = await fetch(`/api/staff/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail, phone: editPhone }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update client");
      }
      setEditingClient(false);
      fetchClient();
    } catch (err: any) {
      setEditClientError(err.message);
    }
  }

  if (loading) return <div className="p-8">Loading client...</div>;
  if (!client) return <div className="p-8 text-red-600">Client not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        ← Back
      </Button>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {editingClient ? (
          <form onSubmit={handleEditClient} className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            </div>
            {editClientError && <div className="text-red-600 text-sm mb-2">{editClientError}</div>}
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setEditingClient(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{client.name}</h2>
              <div className="text-gray-600 mb-1">{client.email || "No email"}</div>
              <div className="text-gray-600 mb-1">{client.phone || "No phone"}</div>
            </div>
            <Button variant="outline" onClick={() => setEditingClient(true)}>Edit</Button>
          </div>
        )}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Booking History</h3>
        {(client.appointments || []).length === 0 ? (
          <div className="text-gray-500">No appointments found.</div>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
            {(client.appointments || []).map((apt) => (
              <li key={apt.id} className="p-4">
                <div className="font-medium">{apt.service?.name || "Unknown Service"}</div>
                <div className="text-gray-500 text-sm">
                  {new Date(apt.scheduledFor).toLocaleString()} &bull; Staff: {apt.staff?.name || "Unknown"} &bull; Status: {apt.status || "Unknown"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        {/* Relationship Notes Section */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Relationship Notes</h4>
          <form onSubmit={handleAddNote} className="mb-4 flex gap-2 items-end flex-wrap">
            <Input
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="flex-1 min-w-[200px]"
              required
            />
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="GENERAL">General</option>
              <option value="PREFERENCE">Preference</option>
              <option value="INCIDENT">Incident</option>
              <option value="FEEDBACK">Feedback</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="SPECIAL_REQUEST">Special Request</option>
            </select>
            <select
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="border rounded p-2 text-sm min-w-[180px]"
            >
              <option value="">Select appointment...</option>
              {(client.appointments || []).map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {new Date(apt.scheduledFor).toLocaleString()} — {apt.service.name}
                </option>
              ))}
            </select>
            <Button type="submit" disabled={addingNote}>
              {addingNote ? "Adding..." : "Add Note"}
            </Button>
          </form>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {(!client.relationshipNotes || client.relationshipNotes.length === 0) ? (
            <div className="text-gray-500">No relationship notes found.</div>
          ) : (
            <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
              {client.relationshipNotes.map((note) => (
                <li key={note.id} className="p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {note.noteType} &bull; {new Date(note.createdAt).toLocaleString()}
                    {note.appointmentId && (
                      <span className="ml-2 text-xs text-blue-600">[
                        {client.appointments.find((a) => a.id === note.appointmentId)?.service.name || "Appointment"}
                        , {new Date(client.appointments.find((a) => a.id === note.appointmentId)?.scheduledFor || "").toLocaleString()}]
                      </span>
                    )}
                  </div>
                  <div>{note.content}</div>
                  {user?.id === note.createdById && (
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => openEditNote(note)}>
                      Edit
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Appointment Notes Section */}
        {(client.appointments || []).some((apt) => apt.notes && apt.notes.trim() !== "") && (
          <div>
            <h4 className="font-semibold mb-2">Appointment Notes</h4>
            <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
              {(client.appointments || []).filter((apt) => apt.notes && apt.notes.trim() !== "").map((apt) => (
                <li key={apt.id} className="p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {apt.service.name} &bull; {new Date(apt.scheduledFor).toLocaleString()} &bull; Staff: {apt.staff.name}
                  </div>
                  <div>{apt.notes}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Edit Note Modal */}
        {editingNote && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Note</h2>
              <form onSubmit={handleEditNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    <option value="GENERAL">General</option>
                    <option value="PREFERENCE">Preference</option>
                    <option value="INCIDENT">Incident</option>
                    <option value="FEEDBACK">Feedback</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="SPECIAL_REQUEST">Special Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Appointment</label>
                  <select
                    value={editAppointmentId}
                    onChange={(e) => setEditAppointmentId(e.target.value)}
                    className="border rounded p-2 text-sm min-w-[180px]"
                  >
                    <option value="">Select appointment...</option>
                    {(client.appointments || []).map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {new Date(apt.scheduledFor).toLocaleString()} — {apt.service.name}
                      </option>
                    ))}
                  </select>
                </div>
                {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingNote(null)} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 