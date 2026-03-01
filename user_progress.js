// ============================================
// USER PROGRESS — Read, Save, Update, Delete
// Requires: supabase.js loaded before this file
// ============================================


// ✅ GET all topics for the logged-in user
async function getAllProgress() {
    const { data, error } = await client
        .from('user_progress')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) { console.error('Error fetching progress:', error.message); return []; }
    return data;
}


// ✅ GET progress for one specific topic
async function getSection(section) {
    const { data, error } = await client
        .from('user_progress')
        .select('*')
        .eq('section', section)
        .maybeSingle();

    if (error) { console.error('Error fetching section:', error.message); return null; }
    return data;
}


// ✅ GET only mastered topics — returns plain array of section names
async function getMasteredSections() {
    const { data, error } = await client
        .from('user_progress')
        .select('section')
        .eq('mastered', true);

    if (error) { console.error('Error fetching mastered sections:', error.message); return []; }
    return data.map(row => row.section);
}


// ✅ SAVE OR UPDATE in one call — use this as your main function
async function upsertSection(section, mastered) {
    const { data, error } = await client
        .from('user_progress')
        .upsert(
            { section, mastered, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,section' }
        )
        .select()
        .single();

    if (error) { console.error('Error upserting section:', error.message); return null; }
    return data;
}


// ✅ DELETE a topic
async function deleteSection(section) {
    const { error } = await client
        .from('user_progress')
        .delete()
        .eq('section', section);

    if (error) { console.error('Error deleting section:', error.message); return false; }
    return true;
}
