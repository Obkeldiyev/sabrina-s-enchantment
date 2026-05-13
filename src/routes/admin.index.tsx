import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Award, Inbox, Layers, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest text-white/50">{label}</div>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-3xl font-bold mt-3">{value ?? "—"}</div>
    </div>
  );
}

function useCount(resource: string) {
  const q = useQuery({
    queryKey: [resource],
    queryFn: () => api<any>(`/api/admin/${resource}`, { auth: true }),
    retry: false,
  });
  const list = Array.isArray(q.data) ? q.data : q.data?.data || q.data?.[resource] || [];
  return list.length;
}

function Dashboard() {
  const sections = useCount("sections");
  const achievements = useCount("achievements");
  const contacts = useCount("contacts");
  const media = useCount("media");
  const contactsQ = useQuery({
    queryKey: ["contacts"],
    queryFn: () => api<any>("/api/admin/contacts", { auth: true }),
    retry: false,
  });
  const recent = (Array.isArray(contactsQ.data) ? contactsQ.data : contactsQ.data?.data || []).slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="SECTIONS" value={sections} icon={Layers} />
        <Stat label="ACHIEVEMENTS" value={achievements} icon={Award} />
        <Stat label="CONTACTS" value={contacts} icon={Inbox} />
        <Stat label="MEDIA" value={media} icon={ImageIcon} />
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent contact submissions</h2>
        {recent.length === 0 && <div className="text-white/40 text-sm">No submissions yet.</div>}
        <div className="space-y-3">
          {recent.map((c: any) => (
            <div key={c.id} className="border-b border-white/5 pb-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{c.name}</span>
                <span className="text-white/40">{c.email}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">{c.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
