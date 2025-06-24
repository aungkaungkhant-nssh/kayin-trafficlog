import { getDisciplinaryArticles } from "@/database/displinaryCommitted/disciplinaryArticles";
import { useEffect, useState } from "react";

const useDisciplinaryArticles = () => {
    const [disciplinaryArticles, setDisciplinaryArticles] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await getDisciplinaryArticles() as any;
            setDisciplinaryArticles(data);
        })();
    }, []);

    const disciplinaryArticleOptions = disciplinaryArticles.map((article: any) => ({
        label: article.number,
        value: article.id,
    }));


    return { disciplinaryArticles, disciplinaryArticleOptions };
};

export default useDisciplinaryArticles;