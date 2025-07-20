import { seedData } from '@/database/seed/seedData';
import { seedUser } from '@/database/seed/seedUser';
import { useEffect } from 'react';

const useData = () => {

    useEffect(() => {
        (async () => {
            await seedUser();
            await seedData();
        })();
    }, []);

};

export default useData;