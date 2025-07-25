function normalizeKey(key: string): string {
    return key.replace(/[\u200B-\u200D\uFEFF]/g, '');
}


function getNormalizedValue(item: any, key: string) {
    const normalizedKey = normalizeKey(key);
    // item key တွေကိုလည်း normalize ပြီး access လုပ်မယ်
    // (item object key တွေမှာ invisible char မပါသေးရင် ဒီလိုလည်းရပါတယ်)
    for (const itemKey of Object.keys(item)) {
        if (normalizeKey(itemKey) === normalizedKey) {
            return item[itemKey];
        }
    }
    return undefined;
}

export default getNormalizedValue