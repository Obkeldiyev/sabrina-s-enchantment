import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { RequireAdmin, useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Image, Menu as MenuIcon, Layers, ListChecks,
  Award, Share2, Settings, Inbox, Users, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/navigation", label: "Navigation", icon: MenuIcon },
  { to: "/admin/sections", label: "Sections", icon: Layers },
  { to: "/admin/items", label: "Items", icon: ListChecks },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/socials", label: "Socials", icon: Share2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/contacts", label: "Contacts", icon: Inbox },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Login page is full-bleed, no sidebar
  if (path === "/admin/login") return <Outlet />;
  return (
    <RequireAdmin>
      <Shell />
    </RequireAdmin>
  );
}

function Shell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-white/10 bg-sidebar flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="font-brand text-xl metallic-text">WINDFLOWER</div>
          <div className="text-[10px] tracking-[0.3em] text-white/40">ADMIN</div>
        </div>
        <nav className="p-3 flex-1 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? "bg-primary/15 text-primary" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-white/50 truncate">
            {user?.email}
          </div>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
