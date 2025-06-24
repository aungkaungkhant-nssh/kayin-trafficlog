
import { getCommittedOffensesByArticle } from "@/database/displinaryCommitted/committedOffenses";
import { useEffect, useState } from "react";

export const useCommittedOffenses = (articleId: number) => {
    const [committedOptions, setCommittedOptions] = useState([]);
    console.log("work")
    useEffect(() => {
        if (!articleId) return;

        (async () => {
            const data = await getCommittedOffensesByArticle(articleId);
            const options = data.map((item: any) => ({
                label: item.name,
                value: item.id
            })) as any;
            setCommittedOptions(options);
        })();
    }, [articleId]);

    return committedOptions;
};
