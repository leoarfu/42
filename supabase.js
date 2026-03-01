// ── Supabase Client Init ──────────────────────────
// Include this file on every page, after the CDN script tag:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="supabase.js"></script>

const supabaseUrl = 'https://kpkpptqtuuhnbdntuluc.supabase.co';
const supabaseKey = 'sb_publishable_aws8RQ085UqKFBUWfojluQ_o9R9WKBb';
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);
