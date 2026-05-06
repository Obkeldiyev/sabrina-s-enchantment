import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type Social = { id: number; platform: string; label: string; url: string; isVisible: boolean };

export default function Footer() {
  const { data } = useQuery({
    queryKey: ["landing"],
    queryFn: () => api<any>("/api/landing"),
  });
  const socials: Social[] =
    (data?.socials || data?.socialLinks || []).filter((s: Social) => s.isVisible !== false) || [];
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <img src="/windflower-logo.png" alt="WindFlower" className="h-10" />
          <div>
            <div className="font-brand metallic-text text-lg">WINDFLOWER</div>
            <div className="text-xs tracking-widest text-white/50">ENERGY</div>
          </div>
        </div>
        <p className="text-sm text-white/50 text-center">
          © {new Date().getFullYear()} WindFlower Energy. Redefining how the world captures wind.
        </p>
        <div className="flex md:justify-end gap-4 text-sm text-white/70">
          {socials.length === 0 && <span className="text-white/40">contact@windflower.energy</span>}
          {socials.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="hover:text-white">
              {s.label || s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
