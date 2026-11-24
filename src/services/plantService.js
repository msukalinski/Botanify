import { supabase } from "../lib/supabase";
import { getLastWatered } from "../utils/getLastWatered";

export async function getPlants() {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

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

export async function getPlantById(plantId) {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to view plant details');
    }

    const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', plantId)
        .eq('ownerId', user.id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function createPlant(newPlant) {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

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

export async function updateWaterDate(plantId) {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to update watering date.');
    }

    const { data, error } = await supabase
        .from('plants')
        .update({ lastWateredAt: getLastWatered(0) })
        .eq('id', plantId)
        .eq('ownerId', user.id)
        .select('*')
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deletePlant(plantId) {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to delete this plant');
    }

    const { data, error } = await supabase
        .from('plants')
        .delete()
        .eq('id', plantId)
        .eq('ownerId', user.id)
        .select('id')
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error('Plant was not found or you cannot delete it.');
    }

    return data;
}

export async function updatePlantReminders(plantId, enabled) {
    if (typeof enabled !== 'boolean') {
        throw new Error('Choose a valid reminder preference.');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Log in to change watering reminders.');
    }

    const { data, error } = await supabase
        .from('plants')
        .update({ remindersEnabled: enabled })
        .eq('id', plantId)
        .eq('ownerId', user.id)
        .select('*')
        .single();

    if (error) {
        throw error;
    }

    return data;
}