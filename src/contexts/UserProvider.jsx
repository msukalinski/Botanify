import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }) {
    const [session, setSession] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let active = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, nextSession) => {
                if (!active) {
                    return;
                }

                setSession(nextSession);

                if (event === 'INITIAL_SESSION') {
                    setInitializing(false);
                }
            }
        );

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user: session?.user ?? null,
        session,
        initializing,
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}