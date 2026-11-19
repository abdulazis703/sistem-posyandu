# Konfigurasi Environment Variables (`.env.local`)

Salin file ini menjadi `.env.local` pada proyek utama kamu dan isi nilai variabelnya.

```env
# APP CONFIGURATION
NEXT_PUBLIC_APP_NAME="Sistem Informasi Posyandu & Stunting"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_TIMEZONE="Asia/Jakarta"

# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# LOGIC CONFIGURATION
NEXT_PUBLIC_ZSCORE_ALGORITHM_VERSION="WHO-2006-v1.0"
```