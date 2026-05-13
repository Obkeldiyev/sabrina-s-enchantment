import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { MagneticButton } from "./MagneticButton";

type ContactFormConfig = {
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  sendingLabel?: string;
  successMessage?: string;
  validationMessage?: string;
  errorMessage?: string;
};

export default function ContactForm({ config = {} }: { config?: ContactFormConfig }) {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const m = useMutation({
    mutationFn: (data: typeof form) =>
      api("/api/contact", { method: "POST", body: data }),
    onSuccess: () => {
      if (config.successMessage) toast.success(config.successMessage);
      setForm({ name: "", email: "", message: "" });
    },
    onError: (e: any) => toast.error(e.message || config.errorMessage || ""),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
          if (config.validationMessage) toast.error(config.validationMessage);
          return;
        }
        m.mutate(form);
      }}
      className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <input
          className="bg-white/5 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-primary transition"
          placeholder={config.namePlaceholder || ""}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          className="bg-white/5 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-primary transition"
          placeholder={config.emailPlaceholder || ""}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <textarea
        rows={5}
        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-primary transition resize-none"
        placeholder={config.messagePlaceholder || ""}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <div className="flex justify-end">
        <MagneticButton className="bg-primary text-primary-foreground glow-blue">
          {m.isPending
            ? config.sendingLabel || config.submitLabel || ""
            : config.submitLabel || ""}
        </MagneticButton>
      </div>
    </form>
  );
}
