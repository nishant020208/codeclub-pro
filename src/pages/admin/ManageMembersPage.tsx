import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface WhitelistEntry { id: string; user_code: string; created_at: string; }
interface Profile { id: string; user_code: string; display_name: string | null; created_at: string; }

const ManageMembersPage: React.FC = () => {
  const { user } = useAuth();
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [newCode, setNewCode] = useState("");
  const [tab, setTab] = useState<"whitelist" | "members">("whitelist");

  const fetchData = async () => {
    const [{ data: wl }, { data: profiles }] = await Promise.all([
      supabase.from("whitelist").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setWhitelist(wl || []);
    setMembers(profiles || []);
  };

  useEffect(() => { fetchData(); }, []);

  const addToWhitelist = async () => {
    if (!newCode.trim()) { toast.error("Enter a user ID"); return; }
    const { error } = await supabase.from("whitelist").insert({ user_code: newCode.trim(), added_by: user!.id });
    if (error) { toast.error(error.message); return; }
    toast.success(`${newCode} added to whitelist`);
    setNewCode("");
    fetchData();
  };

  const removeFromWhitelist = async (id: string) => {
    await supabase.from("whitelist").delete().eq("id", id);
    toast.success("Removed from whitelist");
    fetchData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground">Manage Members</h1>

      <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 w-fit">
        <button onClick={() => setTab("whitelist")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "whitelist" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          Whitelist
        </button>
        <button onClick={() => setTab("members")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "members" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          Members ({members.length})
        </button>
      </div>

      {tab === "whitelist" ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToWhitelist()}
              placeholder="Enter student ID to whitelist"
              className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button onClick={addToWhitelist} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {whitelist.map((w) => (
              <div key={w.id} className="glass-card rounded-xl px-5 py-3 flex items-center justify-between">
                <span className="text-foreground font-mono text-sm">{w.user_code}</span>
                <button onClick={() => removeFromWhitelist(w.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {whitelist.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No whitelisted IDs yet</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="glass-card rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{m.display_name || m.user_code}</p>
                <p className="text-xs text-muted-foreground font-mono">{m.user_code}</p>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
            </div>
          ))}
          {members.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No members registered yet</p>}
        </div>
      )}
    </div>
  );
};

export default ManageMembersPage;
