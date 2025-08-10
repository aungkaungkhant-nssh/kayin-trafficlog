
import { getDetailOffender } from "@/database/offenderVehicles/offenderVehicles";
import { useEffect, useState } from "react";

interface PropsType {
    offenderVehicleId: string
}

export const useOffenderDetail = ({ offenderVehicleId }: PropsType) => {
    const [offenderDetails, setOffenderDetails] = useState([]);
    useEffect(() => {
        (async () => {
            if (offenderVehicleId) {
                const data = await getDetailOffender(offenderVehicleId) as any;
                setOffenderDetails(data);
            }
        })();
    }, [offenderVehicleId]);

    return { offenderDetails };
};

