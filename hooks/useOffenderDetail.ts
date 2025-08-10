
import { getDetailOffender } from "@/database/offenderVehicles/offenderVehicles";
import { useEffect, useState } from "react";


export const useOffenderDetail = ({
    offenderVehicleId,
    year,
    page,
    limit = 2,
}: {
    offenderVehicleId: string;
    year: number;
    page: number;
    limit?: number;
}) => {
    const [offenderDetails, setOffenderDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (!offenderVehicleId) return;
        setLoading(true);

        (async () => {
            const offset = (page - 1) * limit;

            const { data, totalCount } = await getDetailOffender(
                offenderVehicleId,
                year,
                limit,
                offset
            );

            setOffenderDetails(data);
            setTotalCount(totalCount);
            setLoading(false);
        })();
    }, [offenderVehicleId, year, page, limit]);

    return { offenderDetails, loading, totalCount };
};

