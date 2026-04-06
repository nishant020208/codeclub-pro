import { useEffect, useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useAntiCheat(page: string) {
  const { user } = useAuth();
  const warningCountRef = useRef(0);
  const [blocked, setBlocked] = useState(false);

  const logEvent = useCallback(async (eventType: string, details: Record<string, any> = {}) => {
    if (!user) return;

    // Show warning to user
    warningCountRef.current += 1;
    const count = warningCountRef.current;

    if (count <= 3) {
      toast.warning(`⚠️ Suspicious activity detected: ${eventType.replace(/_/g, " ")}`, {
        description: `Warning ${count}/3 — Further violations may flag your account.`,
        duration: 5000,
      });
    } else if (count === 4) {
      toast.error("🚫 Multiple violations detected! Your activity is being logged and reviewed.", {
        duration: 8000,
      });
    }

    try {
      await supabase.from("cheat_logs").insert({
        user_id: user.id,
        event_type: eventType,
        page,
        details: { ...details, warning_number: count },
      });
    } catch (e) {
      // silently fail
    }
  }, [user, page]);

  useEffect(() => {
    if (!user) return;

    let tabSwitchCount = 0;

    // Tab switch detection
    const handleVisibility = () => {
      if (document.hidden) {
        tabSwitchCount++;
        logEvent("tab_switch", {
          timestamp: new Date().toISOString(),
          switch_count: tabSwitchCount,
        });
      }
    };

    // Window blur (switching apps)
    const handleBlur = () => {
      logEvent("window_blur", { timestamp: new Date().toISOString() });
    };

    // Copy detection
    const handleCopy = (e: ClipboardEvent) => {
      logEvent("copy", { timestamp: new Date().toISOString() });
    };

    // Paste detection — block in contest pages
    const handlePaste = (e: ClipboardEvent) => {
      const len = e.clipboardData?.getData("text")?.length || 0;
      logEvent("paste", { timestamp: new Date().toISOString(), length: len });
      if (page.includes("dsa") || page.includes("battle") || page.includes("contest")) {
        e.preventDefault();
        toast.error("Pasting is disabled during challenges!", { duration: 3000 });
      }
    };

    // Right-click detection
    const handleContextMenu = (e: MouseEvent) => {
      logEvent("right_click", { timestamp: new Date().toISOString() });
    };

    // Keyboard shortcut detection (Ctrl+C, Ctrl+V, Ctrl+U, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        logEvent("view_source_attempt", { timestamp: new Date().toISOString() });
      }
      if (e.key === "F12") {
        logEvent("devtools_attempt", { timestamp: new Date().toISOString() });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [user, logEvent, page]);

  return { logEvent, blocked };
}
