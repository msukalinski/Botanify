import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { UserContext } from "./UserContext";
import { getPlants } from "../services/plantService";
import { clearPlantReminders, notificationsSupported, schedulePlantReminder, setReminderUser } from "../services/notificationService";

export default function UserProvider({ children }) {
    const [session, setSession] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const userId = session?.user?.id ?? null;

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

    useEffect(() => {
        if (initializing || !notificationsSupported) {
            return;
        }

        let active = true;
        setReminderUser(userId);

        const restoreReminders = async () => {
            await clearPlantReminders();

            if (!userId || !active) {
                return;
            }

            const plants = await getPlants();

            for (const plant of plants) {
                if (!active) {
                    return;
                }

                const warning = await schedulePlantReminder(plant);

                if (warning) {
                    console.warn(warning);
                }
            }
        };

        restoreReminders().catch((err) => console.warn('Could not restore phone reminders:', err.message));

        return () => {
            active = false;
            setReminderUser(null);
        }
    }, [initializing, userId]);

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