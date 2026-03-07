import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, Pin, Tag } from "lucide-react";
import { format } from "date-fns";

const categoryColors: Record<string, string> = {
  general: "bg-primary/10 text-primary",
  hackathon: "bg-[hsl(var(--neon-cyan))]/10 text-[hsl(var(--neon-cyan))]",
  internship: "bg-[hsl(var(--neon-orange))]/10 text-[hsl(var(--neon-orange))]",
  event: "bg-[hsl(var(--neon-pink))]/10 text-[hsl(var(--neon-pink))]",
};

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const { data } = await supabase.from("announcements").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    setAnnouncements(data || []);

    if (user) {
      const { data: reads } = await supabase.from("announcement_reads").select("announcement_id").eq("user_id", user.id);
      setReadIds(new Set((reads || []).map((r: any) => r.announcement_id)));

      // Mark all as read
      const unread = (data || []).filter((a: any) => !(reads || []).find((r: any) => r.announcement_id === a.id));
      if (unread.length > 0) {
        await supabase.from("announcement_reads").insert(
          unread.map((a: any) => ({ announcement_id: a.id, user_id: user.id }))
        );
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Announcements</span></h1>
        <p className="text-muted-foreground mt-1">Stay updated with the latest news from the club</p>
      </div>

      {announcements.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className={`neon-card rounded-2xl p-6 ${!readIds.has(a.id) ? "border-l-4 border-l-primary" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {a.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[a.category] || categoryColors.general}`}>
                    {a.category}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM d, yyyy")}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{a.title}</h3>
              {a.content && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{a.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
