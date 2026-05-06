import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Upload, Copy } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: Media,
});

function Media() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => api<any>("/api/admin/media", { auth: true }),
  });
  const list: any[] = Array.isArray(data) ? data : data?.data || data?.media || [];

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return api("/api/admin/media", { method: "POST", body: fd, multipart: true, auth: true });
    },
    onSuccess: () => { toast.success("Uploaded"); qc.invalidateQueries({ queryKey: ["media"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: number) => api(`/api/admin/media/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["media"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => upload.mutate(f));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:opacity-90">
          <Upload className="w-4 h-4" /> Upload
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </label>
      </div>

      <div
        className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center text-white/40 mb-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
      >
        Drop files here to upload
      </div>

      {isLoading && <div className="text-white/50">Loading…</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {list.map((m: any) => {
          const u = assetUrl(m.url);
          return (
            <div key={m.id} className="group relative border border-white/10 rounded-lg overflow-hidden bg-white/5">
              <img src={u} alt={m.altText || m.filename} className="w-full aspect-square object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur p-2 text-[10px] truncate flex justify-between opacity-0 group-hover:opacity-100 transition">
                <span className="truncate">{m.filename}</span>
                <div className="flex gap-1">
                  <button onClick={() => { navigator.clipboard.writeText(u || ""); toast.success("URL copied"); }} className="text-white/70 hover:text-white">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={() => confirm("Delete?") && del.mutate(m.id)} className="text-white/70 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
