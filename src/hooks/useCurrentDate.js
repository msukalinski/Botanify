import { useCallback, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getLastWatered } from '../utils/getLastWatered';

export default function useCurrentDate() {
    const [today, setToday] = useState(() => getLastWatered(0));
    const refreshToday = useCallback(() => setToday(getLastWatered(0)), []);

    useFocusEffect(useCallback(() => {
        let timeout;

        const tick = () => {
            refreshToday();
            // Calendar boundaries in the watering timezone fall on whole minutes.
            timeout = setTimeout(tick, 60000 - (Date.now() % 60000));
        };

        tick();

        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') refreshToday();
        });

        return () => {
            clearTimeout(timeout);
            subscription.remove();
        };
    }, [refreshToday]));

    return { today, refreshToday };
}
