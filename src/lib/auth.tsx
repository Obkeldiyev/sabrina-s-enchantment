import * as React from "react";
import { Navigate } from "@tanstack/react-router";
import { api, tokenStore } from "./api";

type User = { id: number; name: string; email: string; role: string };
type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = tokenStore.get();
    if (!t) {
      setLoading(false);
      return;
    }
    api<{ user: User }>("/api/auth/me", { auth: true })
      .then((r) => setUser(r.user || (r as any)))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api<any>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const token = r.token || r.accessToken;
    tokenStore.set(token);
    setUser(r.user || r.admin || null);
    if (!r.user) {
      const me = await api<any>("/api/auth/me", { auth: true });
      setUser(me.user || me);
    }
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  if (!user) return <Navigate to="/admin/login" />;
  return <>{children}</>;
}
