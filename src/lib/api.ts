export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "https://windflowerenergy.uz/api";

const TOKEN_KEY = "wf_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function assetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/windflower-")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

type Opts = {
  method?: string;
  body?: any;
  multipart?: boolean;
  auth?: boolean;
  query?: Record<string, any>;
};

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const { method = "GET", body, multipart, auth, query } = opts;
  const headers: Record<string, string> = {};
  if (!multipart && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = tokenStore.get();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  let url = `${API_BASE}${path}`;
  if (query) {
    const qs = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v != null && v !== "") as any,
    ).toString();
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: multipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && auth) {
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("windflower:unauthorized"));
    }
  }
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      msg = j.message || j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Object.keys(data).length === 1
  ) {
    return data.data as T;
  }
  return data;
}
