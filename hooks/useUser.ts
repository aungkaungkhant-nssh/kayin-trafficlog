import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const useUser = () => {

    useEffect(() => {
        (async () => {
            const session = await SecureStore.getItemAsync('officerSession');


        })();
    }, []);

};

export default useUser;