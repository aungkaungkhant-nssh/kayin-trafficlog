import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export async function exportSeizureDataToJson(
    data: any,
    fileName: string,
    isShare: boolean = false
) {
    try {
        // Get data from your existing function

        // Convert to JSON
        const jsonString = JSON.stringify(data, null, 2);

        // Create a path for the file
        const fileUri = FileSystem.documentDirectory + fileName;

        // Write JSON string to file
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (!isShare) {
            if (Platform.OS === "android") {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
                    await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/json')
                        .then(async (uri) => {
                            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                        })
                        .catch(e => console.log(e));
                }
            }
        }
        else {
            // // Optional: Share the file using native share dialog
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                console.warn('❌ Sharing is not available on this device');
            }
        }



    } catch (error) {
        console.error('❌ Failed to export JSON:', error);
    }
}
