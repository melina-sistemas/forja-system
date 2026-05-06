export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const schema = process.env.SUPABASE_SCHEMA ?? "public";

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env."
    );
  }

  return {
    url,
    serviceRoleKey,
    schema
  };
}

