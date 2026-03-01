import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Swords, Calendar } from "lucide-react";

interface Competition {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
}

const CompetitionsPage: React.FC = () => {
  const [comps, setComps] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("competitions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setComps(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Competitions</h1>
        <p className="text-muted-foreground mt-1">Join coding challenges and compete</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="shimmer h-32 rounded-xl" />)}</div>
      ) : comps.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No competitions yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {comps.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
              {c.description && <p className="text-sm text-muted-foreground mt-2">{c.description}</p>}
              {c.deadline && (
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Deadline: {new Date(c.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitionsPage;
