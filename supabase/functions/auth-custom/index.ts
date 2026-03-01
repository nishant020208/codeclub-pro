import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, user_code, code, password } = await req.json();
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "register") {
      // Check if admin
      const isAdmin = user_code === "admin166";

      if (!isAdmin) {
        // Check whitelist
        const { data: wl } = await supabaseAdmin
          .from("whitelist")
          .select("user_code")
          .eq("user_code", user_code)
          .single();

        if (!wl) {
          return new Response(JSON.stringify({ error: "ID not whitelisted" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      // Verify registration code
      const { data: settings } = await supabaseAdmin
        .from("admin_settings")
        .select("value")
        .eq("key", "registration_code")
        .single();

      if (!settings || settings.value !== code) {
        return new Response(JSON.stringify({ error: "Invalid registration code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already registered
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("user_code", user_code)
        .single();

      if (existingProfile) {
        return new Response(JSON.stringify({ error: "ID already registered" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create user in auth
      const email = `${user_code}@codeclub.pro`;
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const userId = authData.user.id;

      // Create profile
      await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        user_code,
        display_name: user_code,
      });

      // Assign role
      const role = isAdmin ? "admin" : "member";
      await supabaseAdmin.from("user_roles").insert({
        user_id: userId,
        role,
      });

      // If admin, also add to whitelist
      if (isAdmin) {
        await supabaseAdmin.from("whitelist").upsert({ user_code: "admin166", added_by: userId });
      }

      return new Response(JSON.stringify({ success: true, role }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_role") {
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user_code) // here user_code is actually user_id
        .single();

      return new Response(JSON.stringify({ role: roleData?.role || "member" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
