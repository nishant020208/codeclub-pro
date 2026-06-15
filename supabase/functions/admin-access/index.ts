import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Please sign in first." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");

    if (action === "grant_admin") {
      const passcode = String(body.passcode ?? "").trim();
      const { data: setting } = await admin.from("admin_settings").select("value").eq("key", "admin_passcode").maybeSingle();
      if (!setting?.value || passcode !== setting.value) {
        return new Response(JSON.stringify({ error: "Invalid admin passcode." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await admin.from("user_roles").delete().eq("user_id", userData.user.id).eq("role", "member");
      const { error } = await admin.from("user_roles").upsert({ user_id: userData.user.id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true, role: "admin" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "change_passcode") {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Admin access required." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const passcode = String(body.passcode ?? "").trim();
      if (!/^\d{4,12}$/.test(passcode)) {
        return new Response(JSON.stringify({ error: "Passcode must be 4-12 digits." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { error } = await admin.from("admin_settings").upsert({ key: "admin_passcode", value: passcode }, { onConflict: "key" });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});