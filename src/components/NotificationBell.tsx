import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const { count: total } = await supabase.from("announcements").select("id", { count: "exact", head: true });
      const { count: readCount } = await supabase.from("announcement_reads").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      setUnread(Math.max(0, (total || 0) - (readCount || 0)));
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <button onClick={() => navigate("/dashboard/announcements")} className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
      <Bell className="w-5 h-5 text-muted-foreground" />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
