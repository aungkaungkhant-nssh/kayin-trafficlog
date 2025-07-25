import { deleteOldData } from '@/database/offenderVehicles/offenderVehicles';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SessionContextType {
    officer: any;
    loading: boolean;
    setOfficer: (officer: any) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [officer, setOfficer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await deleteOldData();
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

    return (
        <SessionContext.Provider value={{ officer, loading, setOfficer }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error('useSession must be used within a SessionProvider');
    return context;
};
