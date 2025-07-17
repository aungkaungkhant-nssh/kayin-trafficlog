import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function importJsonFile() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
            multiple: false, // optional
        });

        if (result.canceled || !result.assets?.[0]?.uri) {
            console.log('User canceled or invalid file');
            return null;
        }

        const fileUri = result.assets[0].uri;

        // Read JSON content from file
        const jsonString = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        const parsedData = JSON.parse(jsonString);

        console.log('✅ Parsed JSON data:', parsedData);

        return parsedData;
    } catch (error) {
        console.error('❌ Failed to import JSON:', error);
        return null;
    }
}
