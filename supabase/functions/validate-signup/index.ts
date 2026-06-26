import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json().catch(() => ({}));
    const regCode = String(body.regCode ?? "").trim();
    const username = String(body.username ?? "").trim().toLowerCase();

    if (!regCode) {
      return new Response(JSON.stringify({ error: "Registration code is required." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: codeSetting } = await admin.from("admin_settings").select("value").eq("key", "registration_code").maybeSingle();
    const expected = (codeSetting?.value ?? "").trim();
    if (!expected || regCode !== expected) {
      return new Response(JSON.stringify({ error: "Invalid registration code." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Whitelist check — only enforced if whitelist has any rows
    const { count } = await admin.from("whitelist").select("id", { count: "exact", head: true });
    if ((count ?? 0) > 0) {
      if (!username) {
        return new Response(JSON.stringify({ error: "Username is required." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: match } = await admin.from("whitelist").select("id").eq("user_code", username).maybeSingle();
      if (!match) {
        return new Response(JSON.stringify({ error: "Your user ID is not whitelisted. Contact an admin." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Validation failed." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
