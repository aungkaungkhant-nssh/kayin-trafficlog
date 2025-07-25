import * as FileSystem from 'expo-file-system';

export async function getJsonData(files: any) {
    const allData = []
    try {
        for (const file of files) {
            const jsonString = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            const parsedData = JSON.parse(jsonString);
            allData.push(...parsedData);
        }
        return allData.sort((a, b) => a.seizure_id - b.seizure_id);;
    } catch (error) {
        console.error('❌ Failed to import JSON:', error);
        return null;
    }
}
