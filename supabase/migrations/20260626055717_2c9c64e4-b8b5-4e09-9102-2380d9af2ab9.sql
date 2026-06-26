
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mobile text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_username text;
  v_full_name text;
  v_role text;
  v_user_code text;
  v_mobile text;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'member');
  v_user_code := COALESCE(NEW.raw_user_meta_data->>'user_code', v_username);
  v_mobile := NEW.raw_user_meta_data->>'mobile';

  INSERT INTO public.profiles (user_id, user_code, username, full_name, display_name, email, mobile)
  VALUES (NEW.id, v_user_code, v_username, v_full_name, v_full_name, NEW.email, v_mobile)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN v_role = 'admin' THEN 'admin'::app_role ELSE 'member'::app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;
