import { useQuery } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";

type Social = { id: number; platform: string; label: string; url: string; isVisible: boolean };

export default function Footer() {
  const { data } = useQuery({
    queryKey: ["landing"],
    queryFn: () => api<any>("/api/landing"),
    refetchOnMount: "always",
  });

  const socials: Social[] =
    (data?.socials || data?.socialLinks || []).filter((social: Social) => social.isVisible !== false) || [];
  const brand = data?.settings?.brand || {};
  const footer = (data?.sections || []).find((section: any) => section.key === "footer");
  const logo = assetUrl(footer?.image?.url || brand.logoUrl);

  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          {logo && <img src={logo} alt={footer?.title || brand.name || ""} className="h-10" />}
          <div>
            <div className="font-brand metallic-text text-lg">{footer?.title || ""}</div>
          </div>
        </div>
        <p className="text-sm text-white/50 text-center">
          {footer?.config?.copyright || footer?.body || ""}
        </p>
        <div className="flex md:justify-end gap-4 text-sm text-white/70">
          {socials.map((social) => (
            <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="hover:text-white">
              {social.label || social.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
