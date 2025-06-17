import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const useLoadSession = () => {
    const [officer, setOfficer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const session = await SecureStore.getItemAsync('officerSession');

                if (session) {
                    setOfficer(JSON.parse(session));
                }
            } catch (e) {
                console.warn('Failed to load session', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { officer, loading };
};

export default useLoadSession;
