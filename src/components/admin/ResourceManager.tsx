import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from "lucide-react";

export type Field = {
  name: string;
  label?: string;
  type: "text" | "textarea" | "number" | "switch" | "select" | "json" | "image" | "password";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type Props = {
  title: string;
  resource: string; // e.g. "achievements"
  fields: Field[];
  multipart?: boolean; // for image upload via multipart (e.g. achievements)
  imageField?: string; // field name to send file as
};

export default function ResourceManager({ title, resource, fields, multipart, imageField = "image" }: Props) {
  const qc = useQueryClient();
  const path = `/api/admin/${resource}`;
  const { data, isLoading, error } = useQuery({
    queryKey: [resource],
    queryFn: () => api<any>(path, { auth: true }),
    retry: false,
  });
  const list: any[] = Array.isArray(data) ? data : data?.data || data?.[resource] || data?.items || [];

  const [editing, setEditing] = React.useState<any | null>(null);
  const [creating, setCreating] = React.useState(false);

  const del = useMutation({
    mutationFn: (id: number) => api(`${path}/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ["landing"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {error && (
        <div className="text-amber-400 text-sm mb-4">
          {(error as Error).message}
        </div>
      )}

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60">
            <tr>
              <th className="px-4 py-3 w-16">ID</th>
              {fields.slice(0, 4).map((f) => (
                <th key={f.name} className="px-4 py-3">{f.label || f.name}</th>
              ))}
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-white/40">Loading…</td></tr>
            )}
            {!isLoading && list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-white/40">No records</td></tr>
            )}
            {list.map((row: any) => (
              <tr key={row.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white/40">{row.id}</td>
                {fields.slice(0, 4).map((f) => (
                  <td key={f.name} className="px-4 py-3 max-w-xs truncate">
                    {f.type === "image" ? (
                      row[f.name]?.url || row.image?.url ? (
                        <img src={assetUrl(row[f.name]?.url || row.image?.url)} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-white/30" />
                      )
                    ) : f.type === "switch" ? (
                      row[f.name] ? "Yes" : "No"
                    ) : f.type === "json" ? (
                      <code className="text-xs text-white/50">{row[f.name] ? "{…}" : ""}</code>
                    ) : (
                      String(row[f.name] ?? "")
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(row)} className="text-white/60 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirm(`Delete #${row.id}?`) && del.mutate(row.id)}
                      className="text-white/60 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <FormModal
          title={editing ? `Edit #${editing.id}` : "Create"}
          fields={fields}
          initial={editing || {}}
          multipart={multipart}
          imageField={imageField}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSubmit={async (payload, file) => {
            const id = editing?.id;
            const url = id ? `${path}/${id}` : path;
            const method = id ? "PATCH" : "POST";
            try {
              if (multipart && file) {
                const fd = new FormData();
                Object.entries(payload).forEach(([k, v]) => {
                  if (v != null) fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
                });
                fd.append(imageField, file);
                await api(url, { method, body: fd, multipart: true, auth: true });
              } else {
                await api(url, { method, body: payload, auth: true });
              }
              toast.success(id ? "Updated" : "Created");
              qc.invalidateQueries({ queryKey: [resource] });
              qc.invalidateQueries({ queryKey: ["landing"] });
              setEditing(null); setCreating(false);
            } catch (e: any) {
              toast.error(e.message);
            }
          }}
        />
      )}
    </div>
  );
}

function FormModal({
  title, fields, initial, onClose, onSubmit, multipart,
}: {
  title: string;
  fields: Field[];
  initial: any;
  multipart?: boolean;
  imageField?: string;
  onClose: () => void;
  onSubmit: (payload: any, file?: File | null) => void | Promise<void>;
}) {
  const [state, setState] = React.useState<any>(() => {
    const init: any = {};
    fields.forEach((f) => {
      init[f.name] =
        initial[f.name] ?? (f.type === "switch" ? f.name === "isVisible" || f.name === "isActive" : "");
    });
    return init;
  });
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form
          className="p-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            const payload: any = { ...state };
            let valid = true;
            fields.forEach((f) => {
              if (f.type === "number") payload[f.name] = payload[f.name] === "" ? null : Number(payload[f.name]);
              if (f.type === "json" && typeof payload[f.name] === "string" && payload[f.name]) {
                try { payload[f.name] = JSON.parse(payload[f.name]); }
                catch { toast.error(`Invalid JSON in ${f.name}`); valid = false; }
              }
              if (f.type === "image") delete payload[f.name];
            });
            if (!valid) {
              setSubmitting(false);
              return;
            }
            await onSubmit(payload, file);
            setSubmitting(false);
          }}
        >
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">
                {f.label || f.name}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-primary"
                  value={state[f.name] || ""}
                  onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                />
              ) : f.type === "switch" ? (
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!state[f.name]}
                    onChange={(e) => setState({ ...state, [f.name]: e.target.checked })}
                  />
                  <span className="text-sm">{f.placeholder || "Enabled"}</span>
                </label>
              ) : f.type === "select" ? (
                <select
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-primary"
                  value={state[f.name] || ""}
                  onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
                >
                  <option value="">—</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === "json" ? (
                <textarea
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 font-mono text-xs outline-none focus:border-primary"
                  value={typeof state[f.name] === "string" ? state[f.name] : state[f.name] ? JSON.stringify(state[f.name], null, 2) : ""}
                  onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
                  placeholder='{"key": "value"}'
                />
              ) : f.type === "image" ? (
                <div className="space-y-2">
                  {(initial[f.name]?.url || initial.image?.url) && !file && (
                    <img src={assetUrl(initial[f.name]?.url || initial.image?.url)} className="w-32 h-32 object-cover rounded" />
                  )}
                  {file && <div className="text-xs text-white/60">{file.name}</div>}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block text-sm"
                  />
                </div>
              ) : (
                <input
                  type={f.type === "password" ? "password" : f.type === "number" ? "number" : "text"}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:border-primary"
                  value={state[f.name] ?? ""}
                  onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded border border-white/10 hover:bg-white/5">
              Cancel
            </button>
            <button disabled={submitting} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground font-semibold disabled:opacity-50">
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
          {multipart && <p className="text-xs text-white/40">Files uploaded via multipart.</p>}
        </form>
      </div>
    </div>
  );
}
