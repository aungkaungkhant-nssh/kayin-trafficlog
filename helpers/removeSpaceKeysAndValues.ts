const removeSpacesFromKeysAndValues = (data: Record<string, any>[]) => {
    return data.map((entry: Record<string, any>) => {
        const newEntry = {} as any;
        for (const [key, value] of Object.entries(entry)) {
            const cleanedKey = key.replace(/\s+/g, '');
            const cleanedValue =
                typeof value === 'string'
                    ? value.replace(/\s+/g, '')
                    : value;
            newEntry[cleanedKey] = cleanedValue;
        }
        return newEntry;
    });
};


export default removeSpacesFromKeysAndValues;

