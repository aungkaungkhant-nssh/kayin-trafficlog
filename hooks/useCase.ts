import { caseFilterWithDate } from "@/database/offenderVehicles/offenderVehicles";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 10;

export const useCaseFilterWithDate = (
    startDateStr: string | null,
    endDateStr: string | null
) => {
    const [cases, setCases] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Function to fetch data for a page
    const fetchData = useCallback(
        async (pageToFetch: number, reset = false) => {
            if (!startDateStr || !endDateStr) {
                setCases([]);
                setHasMore(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await caseFilterWithDate(
                    startDateStr,
                    endDateStr,
                    PAGE_SIZE,
                    pageToFetch * PAGE_SIZE
                ) as any;

                if (reset) {
                    setCases(data);
                } else {
                    setCases((prev: any) => [...prev, ...data]);
                }

                // If returned data less than page size, no more data
                setHasMore(data.length === PAGE_SIZE);
                setPage(pageToFetch);
            } catch (err: any) {
                setError(err.message || "Failed to fetch cases");
            } finally {
                setLoading(false);
            }
        },
        [startDateStr, endDateStr]
    );

    // Reset and fetch page 0 whenever filters change
    useEffect(() => {
        setCases([]);
        setPage(0);
        setHasMore(true);

        if (startDateStr && endDateStr) {
            fetchData(0, true);
        } else {
            setCases([]);
            setHasMore(false);
        }
    }, [startDateStr, endDateStr, fetchData]);

    // Load more function for infinite scroll
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchData(page + 1);
        }
    };

    return { cases, loading, error, loadMore, hasMore };
};
