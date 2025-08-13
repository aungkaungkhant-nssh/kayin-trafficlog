import { getSeizureYearsBeforeTargetYear } from "@/database/offenderVehicles/offenderVehicles";
import { useEffect, useState } from "react";

export const useTrashYear = () => {
    const year = new Date().getFullYear() - 4;
    const [trashYears, setTrashYears] = useState([]);
    const [trashYearLoading, setTrashYearLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            setTrashYearLoading(true)
            const data = await getSeizureYearsBeforeTargetYear(year) as any;
            if (data.length) {
                setSelectedYear(data[0])
            }
            setTrashYears(data);
            setTrashYearLoading(false)
        })();
    }, []);

    return { trashYears, trashYearLoading, selectedYear, setSelectedYear, setTrashYears };
};

