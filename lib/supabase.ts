// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://siqeqzsubysplsmrdrqx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcWVxenN1YnlzcGxzbXJkcnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODMzMDEsImV4cCI6MjA2Njk1OTMwMX0.aYtb6PV6BmmkRCU1ZxUWUBLJnOUoIM8oivEM_I2DvD0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
