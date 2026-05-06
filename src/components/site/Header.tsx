import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type Nav = { id: number; label: string; href: string; isVisible: boolean; sortOrder: number };

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { data } = useQuery({
    queryKey: ["landing"],
    queryFn: () => api<any>("/api/landing"),
  });
  const navItems: Nav[] =
    (data?.navigation || data?.nav || []).filter((n: Nav) => n.isVisible !== false) || [];
  const fallback = [
    { label: "ABOUT", href: "#about" },
    { label: "TECHNOLOGY", href: "#technology" },
    { label: "APPLICATIONS", href: "#applications" },
    { label: "ACHIEVEMENTS", href: "#achievements" },
    { label: "CONTACT", href: "#contact" },
  ];
  const items = navItems.length ? navItems : fallback;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2 glass-strong" : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/windflower-logo.png" alt="WindFlower" className="h-10 w-auto" />
          <span className="font-brand text-lg metallic-text hidden sm:inline">WINDFLOWER</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.2em]">
          {items.map((it: any) => (
            <a
              key={it.href + it.label}
              href={it.href}
              className="relative text-white/80 hover:text-white transition story-link"
            >
              {it.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="text-primary/90 hover:text-primary"
          >
            ADMIN
          </Link>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden glass-strong border-t border-white/10 px-6 py-4 space-y-3">
          {items.map((it: any) => (
            <a key={it.href + it.label} href={it.href} className="block text-sm tracking-widest" onClick={() => setOpen(false)}>
              {it.label}
            </a>
          ))}
          <Link to="/admin" className="block text-sm tracking-widest text-primary">
            ADMIN
          </Link>
        </div>
      )}
    </nav>
  );
}
