import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAntiCheat(page: string) {
  const { user } = useAuth();

  const logEvent = useCallback(async (eventType: string, details: Record<string, any> = {}) => {
    if (!user) return;
    try {
      await supabase.from("cheat_logs").insert({
        user_id: user.id,
        event_type: eventType,
        page,
        details,
      });
    } catch (e) {
      // silently fail
    }
  }, [user, page]);

  useEffect(() => {
    if (!user) return;

    // Tab switch detection
    const handleVisibility = () => {
      if (document.hidden) {
        logEvent("tab_switch", { timestamp: new Date().toISOString() });
      }
    };

    // Copy/paste detection
    const handleCopy = (e: ClipboardEvent) => {
      logEvent("copy", { timestamp: new Date().toISOString() });
    };
    const handlePaste = (e: ClipboardEvent) => {
      logEvent("paste", { timestamp: new Date().toISOString(), length: e.clipboardData?.getData("text")?.length || 0 });
    };

    // Right-click detection
    const handleContextMenu = (e: MouseEvent) => {
      logEvent("right_click", { timestamp: new Date().toISOString() });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [user, logEvent]);

  return { logEvent };
}
