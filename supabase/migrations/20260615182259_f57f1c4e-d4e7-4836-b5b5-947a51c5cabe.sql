DROP POLICY IF EXISTS "Anyone can read registration code" ON public.admin_settings;
DROP POLICY IF EXISTS "Authenticated can read settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.admin_settings;

CREATE POLICY "Admins can manage settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));