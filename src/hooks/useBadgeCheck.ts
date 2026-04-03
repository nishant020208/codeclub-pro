import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBadgeCheck = () => {
  const { user } = useAuth();

  const checkBadges = useCallback(async () => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-badges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });

      if (!resp.ok) return;
      const data = await resp.json();
      if (data.badge_count > 0) {
        data.awarded_badges.forEach((title: string) => {
          toast.success(`🏅 Badge Earned: ${title}!`, { duration: 5000 });
        });
      }
      if (data.achievement_count > 0) {
        data.awarded_achievements.forEach((title: string) => {
          toast.success(`🏆 Achievement Unlocked: ${title}!`, { duration: 5000 });
        });
      }
    } catch (e) {
      console.error("Badge check failed:", e);
    }
  }, [user]);

  return { checkBadges };
};
