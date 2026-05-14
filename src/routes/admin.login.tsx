import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import * as React from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: Login,
});

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user && path === "/admin/login") navigate({ to: "/admin" });
  }, [user, navigate, path]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 grid place-items-center px-6">
      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 w-full max-w-md space-y-5">
        <div>
          <div className="font-brand text-3xl text-white">WINDFLOWER</div>
          <div className="text-xs tracking-[0.3em] text-white/40">ADMIN LOGIN</div>
        </div>
        <input
          type="email"
          className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-primary transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <input
          type="password"
          className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 outline-none focus:border-primary transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />
        <button
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>
        <a
          href="/"
          className="block text-center text-sm text-white/60 transition hover:text-white"
        >
          Back to landing
        </a>
      </form>
    </div>
  );
}
