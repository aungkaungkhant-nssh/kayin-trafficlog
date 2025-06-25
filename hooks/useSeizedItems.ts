
import { getSeizedItems } from "@/database/seizedItem/seizedItem";
import { useEffect, useState } from "react";

export const useSeizedItems = () => {
    const [seizedItems, setSeizedItems] = useState([]);
    useEffect(() => {
        (async () => {
            const data = await getSeizedItems() as any;
            const options = data.map((item: any) => ({
                label: item.name,
                value: item.id
            })) as any;
            setSeizedItems(options);
        })();
    }, []);

    return { seizedItems };
};

