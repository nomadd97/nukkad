/* Nukkad settings. The anon key below is Supabase's PUBLIC key: it is meant to be in the app.
   What it can do is limited by the database rules (Row Level Security) in supabase/schema.sql.
   Never put the service_role / secret key here. */
window.NK_CONFIG = {
  supabaseUrl: 'https://wezrqzxmzqbzyuzcrraf.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlenJxenhtenFienl1emNycmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzIxMzMsImV4cCI6MjEwODM0ODEzM30.VQgJiHkxnReumNS-qP_BQBpxr3DGSW4WqMYI1VUz2gI',
  publicUrl: '',            // set after Vercel deploy, e.g. 'https://nukkad.vercel.app/'
  smartFillFunction: 'smart-fill',
  botNumber: ''             // Nukkad's WhatsApp bot number (digits only), set after Meta setup
};
