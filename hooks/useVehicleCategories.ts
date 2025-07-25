import { getVehicleCategories } from "@/database/vehicleCategories/vehicleCategories";
import { useEffect, useState } from "react";

export const useVehicleCategories = () => {
    const [vehicleCategories, setVehicleCategories] = useState([]);
    
    useEffect(() => {
        (async () => {
            const data = await getVehicleCategories() as any;
            const options = data.map((item: any) => ({
                label: item.name,
                value: String(item.id)
            })) as any;
            setVehicleCategories(options);
        })();
    }, []);

    return { vehicleCategories };
};

