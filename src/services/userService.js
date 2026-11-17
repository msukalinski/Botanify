import { supabase } from "../lib/supabase";

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function registerUser({ username, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
            data: {
                username: username.trim(),
            }
        },
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut({
        scope: "local",
    });

    if (error) {
        throw error;
    }
}