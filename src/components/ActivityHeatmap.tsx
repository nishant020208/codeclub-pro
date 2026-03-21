import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ActivityHeatmap: React.FC = () => {
  const { user } = useAuth();
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_activity")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data }) => {
        const map: Record<string, number> = {};
        (data || []).forEach((a: any) => {
          const day = a.created_at.split("T")[0];
          map[day] = (map[day] || 0) + 1;
        });
        setActivityMap(map);
      });
  }, [user]);

  // Generate last 20 weeks (140 days)
  const today = new Date();
  const weeks: string[][] = [];
  for (let w = 19; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 1) return "bg-primary/20";
    if (count <= 3) return "bg-primary/40";
    if (count <= 5) return "bg-primary/60";
    return "bg-primary/90";
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="terminal-card rounded-lg p-4">
      <p className="text-xs font-mono text-muted-foreground mb-3">$ git log --activity-graph</p>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => {
              const count = activityMap[day] || 0;
              return (
                <div
                  key={day}
                  className={`w-3 h-3 rounded-[2px] ${getColor(count)} transition-colors`}
                  title={`${day}: ${count} activities`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-muted-foreground font-mono">less</span>
        {[0, 1, 3, 5, 7].map((n) => (
          <div key={n} className={`w-3 h-3 rounded-[2px] ${getColor(n)}`} />
        ))}
        <span className="text-[10px] text-muted-foreground font-mono">more</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
