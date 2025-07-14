function getArticleAndOffense(value: string) {
    const match = value.match(/^(.+?)\((.+?)\)/);

    if (match) {
        const articleNumber = match[1].trim();  // "၉၁ က"
        const offenseName = match[2].trim(); // "မောင်းမရှိ"
        return { articleNumber, offenseName }
    } else {
        console.log("No match found");
    }
}

export default getArticleAndOffense;