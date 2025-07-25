
import { getCommittedOffensesByArticle, getFineAmount } from "@/database/displinaryCommitted/committedOffenses";
import { useEffect, useState } from "react";

export const useCommittedOffenses = (articleId: number) => {
    const [committedOptions, setCommittedOptions] = useState([]);
    useEffect(() => {
        if (!articleId) return;

        (async () => {
            const data = await getCommittedOffensesByArticle(articleId);
            const options = data.map((item: any) => ({
                label: item.name,
                value: String(item.id)
            })) as any;
            setCommittedOptions(options);
        })();
    }, [articleId]);

    return committedOptions;
};


export const useFineAmount = (articleValue: number, committedValue: number) => {
    const [fineAmount, setFineAmount] = useState([]);
    useEffect(() => {
        if (!articleValue || !committedValue) return;

        (async () => {
            const fineAmount = await getFineAmount(articleValue, committedValue);
            if (fineAmount) {
                setFineAmount(fineAmount);
            }
        })();
    }, [articleValue, committedValue]);

    return { fineAmount }
};

