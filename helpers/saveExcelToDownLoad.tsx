import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';

export async function saveExcelToDownloads(data: any[], fileName = 'cases.xlsx', isShare = false) {

    const formatData = data.map((d) => {
        return {
            "ရက်စွဲ": d.seized_date,
            "ယာဉ်အမှတ်": d.vehicle_number,
            "အမျိုးအစား/အရောင်": d.vehicle_types,
            "နေရာ": d.seizure_location,
            "အမည်": d.offender_name,
            "မှတ်ပုံတင်": d?.national_id_number || "မရှိ",
            "အဘအမည်": d.offender_father_name,
            "နေရပ်လိပ်စာ": d.offender_address,
            "အရေးယူပုဒ်မ": `${d.article_number}(${d.offense_name})`,
            "အရေးယူအရာရှိ": d.officer_name,
            "အရေးယူရက်စွဲ": d?.action_date || "",
            "ရာကြီးအမှတ်": d?.case_number || "",
            "ဒဏ်ငွေ": d.fine_amount,
            "သိမ်းဆည်းပစ္စည်း": d.seized_item_name,
            "မှတ်ချက်": "",
        }
    })

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formatData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate the Excel file content as a base64 string
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    // Define the file URI (where to save the file)
    const uri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
    });

    if (!isShare) {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            console.log(permissions)
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch(e => console.log(e));
            }
        }
    } else {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
        } else {
            console.warn('❌ Sharing is not available on this device');
        }
    }

    // Write the base64 data to the file

}
