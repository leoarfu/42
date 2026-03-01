// ============================================
// USER PROGRESS — Read, Save, Update, Delete
// Requires: supabase CDN + client already init
//   in your HTML before this script loads
// ============================================


// ✅ GET all topics for the logged-in user
// Returns array of all their progress rows
async function getAllProgress() {
    const { data, error } = await client
        .from('user_progress')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching progress:', error.message);
        return [];
    }
    return data; // e.g. [{ id, user_id, section, mastered, updated_at }, ...]
}


// ✅ GET progress for one specific topic
// Returns a single row or null
async function getSection(section) {
    const { data, error } = await client
        .from('user_progress')
        .select('*')
        .eq('section', section)
        .maybeSingle(); // returns null if not found (no error)

    if (error) {
        console.error('Error fetching section:', error.message);
        return null;
    }
    return data;
}


// ✅ SAVE a new topic (first time user encounters it)
// mastered defaults to false — they haven't learned it yet
async function saveSection(section, mastered = false) {
    const { data, error } = await client
        .from('user_progress')
        .insert({ section, mastered })
        .select()
        .single();

    if (error) {
        console.error('Error saving section:', error.message);
        return null;
    }
    return data;
}


// ✅ MARK a topic as mastered (or un-mastered)
// Pass mastered = true when they know it, false to reset
async function updateSection(section, mastered) {
    const { data, error } = await client
        .from('user_progress')
        .update({ mastered, updated_at: new Date().toISOString() })
        .eq('section', section)
        .select()
        .single();

    if (error) {
        console.error('Error updating section:', error.message);
        return null;
    }
    return data;
}


// ✅ SAVE OR UPDATE in one smart call
// Use this as your main function — it handles both cases
// If the topic exists it updates it, if not it creates it
async function upsertSection(section, mastered) {
    const { data, error } = await client
        .from('user_progress')
        .upsert(
            { section, mastered, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,section' } // won't duplicate
        )
        .select()
        .single();

    if (error) {
        console.error('Error upserting section:', error.message);
        return null;
    }
    return data;
}


// ✅ DELETE a topic from the user's progress
async function deleteSection(section) {
    const { error } = await client
        .from('user_progress')
        .delete()
        .eq('section', section);

    if (error) {
        console.error('Error deleting section:', error.message);
        return false;
    }
    return true;
}


// ✅ GET only mastered topics
async function getMasteredSections() {
    const { data, error } = await client
        .from('user_progress')
        .select('section')
        .eq('mastered', true);

    if (error) {
        console.error('Error fetching mastered sections:', error.message);
        return [];
    }
    return data.map(row => row.section); // returns plain array of topic names
}


// ============================================
// HOW TO USE — Examples
// ============================================

// Load all progress on page load:
// const progress = await getAllProgress();

// When user opens a topic for the first time:
// await upsertSection('photosynthesis', false);

// When user marks a topic as known:
// await upsertSection('photosynthesis', true);

// Check if a specific topic is mastered:
// const row = await getSection('photosynthesis');
// if (row && row.mastered) { ... }

// Get list of all mastered topics:
// const mastered = await getMasteredSections();
// e.g. ['photosynthesis', 'mitosis', 'osmosis']

// Delete a topic:
// await deleteSection('photosynthesis');
