import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportSeizureDataToJson(
    data: any
) {
    try {
        // Get data from your existing function

        // Convert to JSON
        const jsonString = JSON.stringify(data, null, 2);

        // Create a path for the file
        const fileName = `seizure_data_${Date.now()}.json`;
        const fileUri = FileSystem.documentDirectory + fileName;

        // Write JSON string to file
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        console.log('✅ File saved at:', fileUri);

        // Optional: Share the file using native share dialog
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.warn('❌ Sharing is not available on this device');
        }

    } catch (error) {
        console.error('❌ Failed to export JSON:', error);
    }
}
