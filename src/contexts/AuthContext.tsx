import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "admin" | "member" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  userCode: string | null;
  loading: boolean;
  signIn: (userCode: string, password: string) => Promise<void>;
  register: (userCode: string, code: string, password: string) => Promise<string>;
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

  const fetchRole = useCallback(async (userId: string) => {
    const { data } = await supabase.functions.invoke("auth-custom", {
      body: { action: "get_role", user_code: userId },
    });
    setRole(data?.role || "member");
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("user_code")
      .eq("user_id", userId)
      .single();
    if (data) setUserCode(data.user_code);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          // Wait for both role and profile to be fetched before finishing loading
          await Promise.all([
            fetchRole(session.user.id),
            fetchProfile(session.user.id)
          ]);
        } else {
          setSession(null);
          setUser(null);
          setRole(null);
          setUserCode(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'INITIAL_SESSION' && session)) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRole(session.user.id);
          fetchProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setRole(null);
        setUserCode(null);
      }
      
      // We only care about setting loading to false once on mount
      // subsequent state changes are handled by the session/user state
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole, fetchProfile]);

  const signIn = async (userCode: string, password: string) => {
    const email = `${userCode}@codeclub.pro`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (userCode: string, code: string, password: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("auth-custom", {
      body: { action: "register", user_code: userCode, code, password },
    });
    if (error || data?.error) throw new Error(data?.error || error?.message || "Registration failed");
    return data.role;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setUserCode(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, userCode, loading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
