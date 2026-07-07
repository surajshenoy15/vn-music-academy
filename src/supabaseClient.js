// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const normalizeSupabaseUrl = (rawUrl) => {
  if (typeof rawUrl !== "string") {
    return "";
  }

  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return "";
  }

  try {
    const url = new URL(trimmedUrl);
    const normalizedPath = url.pathname.replace(/\/rest(?:\/v1)?\/?$/, "");
    const normalizedOrigin = `${url.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
    return normalizedOrigin.replace(/\/$/, "");
  } catch {
    return "";
  }
};

const getSupabaseConfig = () => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const supabaseUrl = normalizeSupabaseUrl(rawUrl);
  const supabaseAnonKey = typeof rawKey === "string" ? rawKey.trim() : "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return { configured: false, supabaseUrl: "", supabaseAnonKey: "" };
  }

  try {
    new URL(supabaseUrl);
  } catch {
    return { configured: false, supabaseUrl: "", supabaseAnonKey: "" };
  }

  return { configured: true, supabaseUrl, supabaseAnonKey };
};

export const createSupabaseClient = () => {
  const { configured, supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!configured) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = Boolean(supabase);
