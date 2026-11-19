import { supabase } from "../lib/supabase";

export async function createPlant(newPlant) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to create plant');
    }

    const { data, error } = await supabase
        .from('plants')
        .insert({ ...newPlant, ownerId: user.id })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function getPlants() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to view your plants.');
    }

    const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('ownerId', user.id)
        .order('name', { ascending: true })

    if (error) {
        throw error;
    }

    return data ?? [];
}