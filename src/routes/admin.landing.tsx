import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/landing")({
  component: LandingEditor,
});

type Section = {
  id: number;
  key: string;
  type: string;
  title: string;
  subtitle?: string;
  body?: string;
  sortOrder: number;
  isVisible: boolean;
  items?: Item[];
};

type Item = {
  id: number;
  sectionId: number;
  title: string;
  subtitle?: string;
  body?: string;
  label?: string;
  value?: string;
  unit?: string;
  icon?: string;
  href?: string;
  variant?: string;
  sortOrder: number;
  isVisible: boolean;
};

function LandingEditor() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sections"],
    queryFn: () => api<Section[]>("/api/admin/sections", { auth: true }),
    retry: false,
  });
  const sections = Array.isArray(data) ? data : [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Landing Editor</h1>
        <p className="mt-2 text-sm text-white/50">
          Edit the public landing page section by section. Changes appear on the site after saving.
        </p>
      </div>

      {isLoading && <div className="text-white/50">Loading landing content...</div>}
      {error && <div className="text-amber-400 text-sm">{(error as Error).message}</div>}

      <div className="space-y-4">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(section.key === "hero");
  const [state, setState] = React.useState({
    title: section.title || "",
    subtitle: section.subtitle || "",
    body: section.body || "",
    sortOrder: section.sortOrder || 0,
    isVisible: section.isVisible !== false,
  });

  React.useEffect(() => {
    setState({
      title: section.title || "",
      subtitle: section.subtitle || "",
      body: section.body || "",
      sortOrder: section.sortOrder || 0,
      isVisible: section.isVisible !== false,
    });
  }, [section]);

  const save = useMutation({
    mutationFn: () =>
      api(`/api/admin/sections/${section.id}`, {
        method: "PATCH",
        auth: true,
        body: state,
      }),
    onSuccess: () => {
      toast.success("Section saved");
      qc.invalidateQueries({ queryKey: ["sections"] });
      qc.invalidateQueries({ queryKey: ["landing"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const items = section.items || [];

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">{section.title}</h2>
            <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
              {section.type}
            </span>
            <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
              #{section.key}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/40">
            {items.length} item{items.length === 1 ? "" : "s"} · order {section.sortOrder}
          </p>
        </div>
        <span className="text-sm text-primary">{open ? "Close" : "Edit"}</span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-white/10 p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px_140px]">
            <Field label="Section title">
              <input className="admin-input" value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} />
            </Field>
            <Field label="Order">
              <input className="admin-input" type="number" value={state.sortOrder} onChange={(e) => setState({ ...state, sortOrder: Number(e.target.value) })} />
            </Field>
            <Field label="Visible">
              <button
                type="button"
                onClick={() => setState({ ...state, isVisible: !state.isVisible })}
                className="inline-flex h-10 items-center justify-center gap-2 rounded border border-white/10 px-3 text-sm hover:bg-white/5"
              >
                {state.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {state.isVisible ? "Visible" : "Hidden"}
              </button>
            </Field>
          </div>

          <Field label="Subtitle">
            <input className="admin-input" value={state.subtitle} onChange={(e) => setState({ ...state, subtitle: e.target.value })} />
          </Field>
          <Field label="Body text">
            <textarea className="admin-input min-h-24" value={state.body} onChange={(e) => setState({ ...state, body: e.target.value })} />
          </Field>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save section
            </button>
          </div>

          {section.type !== "SHOWCASE" && section.type !== "CONTACT" && section.type !== "FOOTER" && (
            <ItemsEditor section={section} items={items} />
          )}
        </div>
      )}
    </div>
  );
}

function ItemsEditor({ section, items }: { section: Section; items: Item[] }) {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: () =>
      api("/api/admin/items", {
        method: "POST",
        auth: true,
        body: {
          sectionId: section.id,
          title: "New item",
          sortOrder: items.length + 1,
          isVisible: true,
        },
      }),
    onSuccess: () => {
      toast.success("Item added");
      qc.invalidateQueries({ queryKey: ["sections"] });
      qc.invalidateQueries({ queryKey: ["landing"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Cards, buttons, and numbers</h3>
        <button
          type="button"
          onClick={() => create.mutate()}
          className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
        >
          <Plus className="h-4 w-4" />
          Add item
        </button>
      </div>
      {items.length === 0 && <div className="text-sm text-white/40">No items in this section.</div>}
      {items.map((item) => (
        <ItemRow key={item.id} item={item} sectionType={section.type} />
      ))}
    </div>
  );
}

function ItemRow({ item, sectionType }: { item: Item; sectionType: string }) {
  const qc = useQueryClient();
  const [state, setState] = React.useState({
    title: item.title || "",
    subtitle: item.subtitle || "",
    body: item.body || "",
    label: item.label || "",
    value: item.value || "",
    unit: item.unit || "",
    icon: item.icon || "",
    href: item.href || "",
    variant: item.variant || "",
    sortOrder: item.sortOrder || 0,
    isVisible: item.isVisible !== false,
  });

  React.useEffect(() => {
    setState({
      title: item.title || "",
      subtitle: item.subtitle || "",
      body: item.body || "",
      label: item.label || "",
      value: item.value || "",
      unit: item.unit || "",
      icon: item.icon || "",
      href: item.href || "",
      variant: item.variant || "",
      sortOrder: item.sortOrder || 0,
      isVisible: item.isVisible !== false,
    });
  }, [item]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["sections"] });
    qc.invalidateQueries({ queryKey: ["landing"] });
  };

  const save = useMutation({
    mutationFn: () =>
      api(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        auth: true,
        body: state,
      }),
    onSuccess: () => {
      toast.success("Item saved");
      refresh();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: () => api(`/api/admin/items/${item.id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      toast.success("Item deleted");
      refresh();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="rounded border border-white/10 bg-black/20 p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_120px_120px]">
        <Field label={sectionType === "METRICS" ? "Metric name" : "Item title"}>
          <input className="admin-input" value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} />
        </Field>
        <Field label="Order">
          <input className="admin-input" type="number" value={state.sortOrder} onChange={(e) => setState({ ...state, sortOrder: Number(e.target.value) })} />
        </Field>
        <Field label="Visible">
          <button
            type="button"
            onClick={() => setState({ ...state, isVisible: !state.isVisible })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded border border-white/10 px-3 text-sm hover:bg-white/5"
          >
            {state.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {state.isVisible ? "Visible" : "Hidden"}
          </button>
        </Field>
      </div>

      {sectionType === "METRICS" ? (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="Label under number">
            <input className="admin-input" value={state.label} onChange={(e) => setState({ ...state, label: e.target.value })} />
          </Field>
          <Field label="Number">
            <input className="admin-input" value={state.value} onChange={(e) => setState({ ...state, value: e.target.value })} />
          </Field>
          <Field label="Unit">
            <input className="admin-input" value={state.unit} onChange={(e) => setState({ ...state, unit: e.target.value })} />
          </Field>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Short text">
            <input className="admin-input" value={state.subtitle} onChange={(e) => setState({ ...state, subtitle: e.target.value })} />
          </Field>
          <Field label="Icon text">
            <input className="admin-input" value={state.icon} onChange={(e) => setState({ ...state, icon: e.target.value })} />
          </Field>
          <Field label="Main text">
            <textarea className="admin-input min-h-20" value={state.body} onChange={(e) => setState({ ...state, body: e.target.value })} />
          </Field>
          <Field label="Button/link URL">
            <input className="admin-input" value={state.href} onChange={(e) => setState({ ...state, href: e.target.value })} />
          </Field>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => confirm("Delete this item?") && del.mutate()}
          className="inline-flex items-center gap-2 rounded border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <button
          type="button"
          onClick={() => save.mutate()}
          className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Save className="h-4 w-4" />
          Save item
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-white/45">{label}</span>
      {children}
    </label>
  );
}
