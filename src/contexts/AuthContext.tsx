import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "admin" | "member" | null;

interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  userCode: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUserMeta: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserMeta = useCallback(async (userId: string) => {
    const [profileRes, roleRes] = await Promise.all([
      supabase.from("profiles").select("username, user_code, display_name, full_name").eq("user_id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
    ]);
    const p: any = profileRes.data;
    setUserCode(p?.username || p?.user_code || p?.display_name || p?.full_name || null);
    setRole(((roleRes.data as any)?.role as AppRole) || "member");
  }, []);

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => loadUserMeta(session.user.id), 0);
      } else {
        setRole(null);
        setUserCode(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserMeta(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [loadUserMeta]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw error;
  };

  const refreshUserMeta = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await loadUserMeta(user.id);
  };

  const signUp = async ({ email, password, fullName, username }: SignUpPayload) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName, username: username.trim().toLowerCase() },
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const host = window.location.hostname;
    const isLovableHost = host.endsWith(".lovable.app") || host.endsWith(".lovable.dev") || host === "localhost";
    if (isLovableHost) {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
        extraParams: { prompt: "select_account" },
      });
      if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
      if (!result.redirected) window.location.assign("/dashboard");
      return;
    }
    // Fallback for external hosts (e.g. Vercel) — use Supabase directly
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setUserCode(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, userCode, loading, signIn, signUp, signInWithGoogle, refreshUserMeta, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
