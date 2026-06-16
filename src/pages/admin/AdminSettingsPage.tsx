import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsPage: React.FC = () => {
  const [regCode, setRegCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [savingPasscode, setSavingPasscode] = useState(false);

  useEffect(() => {
    supabase.from("admin_settings").select("key, value").in("key", ["registration_code", "admin_passcode"]).then(({ data }) => {
      if (!data) return;
      const reg = data.find((r: any) => r.key === "registration_code");
      if (reg) setRegCode(reg.value);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("admin_settings")
      .upsert({ key: "registration_code", value: regCode }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Registration code updated");
  };

  const handlePasscodeSave = async () => {
    if (!/^\d{4,12}$/.test(passcode)) {
      toast.error("Passcode must be 4-12 digits");
      return;
    }
    if (passcode !== confirmPasscode) {
      toast.error("Passcodes do not match");
      return;
    }
    setSavingPasscode(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-access", {
        body: { action: "change_passcode", passcode },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success("Admin passcode updated");
      setPasscode("");
      setConfirmPasscode("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update passcode");
    } finally {
      setSavingPasscode(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your coding club</p>
      </div>

      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Registration Code</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Optional code you may share with members during onboarding.
        </p>
        <input
          value={regCode}
          onChange={(e) => setRegCode(e.target.value)}
          className="w-full px-4 py-3 min-h-[48px] rounded-xl bg-secondary/50 border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Code"}
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Admin Passcode</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Used by the floating terminal button to grant admin access. Default is <span className="font-mono text-primary">201914</span>. Change it to a private number only admins know.
        </p>
        <div className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="New passcode (4-12 digits)"
            className="w-full px-4 py-3 min-h-[48px] rounded-xl bg-secondary/50 border border-border text-foreground font-mono tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            inputMode="numeric"
            value={confirmPasscode}
            onChange={(e) => setConfirmPasscode(e.target.value)}
            placeholder="Confirm passcode"
            className="w-full px-4 py-3 min-h-[48px] rounded-xl bg-secondary/50 border border-border text-foreground font-mono tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={handlePasscodeSave}
          disabled={savingPasscode || !passcode || !confirmPasscode}
          className="flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {savingPasscode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {savingPasscode ? "Updating..." : "Update Passcode"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
