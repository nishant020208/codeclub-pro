import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsPage: React.FC = () => {
  const [regCode, setRegCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("admin_settings").select("value").eq("key", "registration_code").single().then(({ data }) => {
      if (data) setRegCode(data.value);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("admin_settings")
      .update({ value: regCode })
      .eq("key", "registration_code");
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Registration code updated!");
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your coding club</p>
      </div>

      <div className="glass-card rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Registration Code</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          This code is required for new members to register. Share it with your students via WhatsApp.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Current Code</label>
          <input
            value={regCode}
            onChange={(e) => setRegCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Code"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
