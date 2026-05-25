import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mawkniaqpixphddjywcg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2tuaWFxcGl4cGhkZGp5d2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTE1OTIsImV4cCI6MjA5NTE4NzU5Mn0.ziHiQTl8H5i70KCIN_3Etpkfzp36d7U--9E_390L8-A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)