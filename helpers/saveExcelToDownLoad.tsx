import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export async function saveExcelToDownloads(data: any[], fileName = 'cases.xlsx') {

    const formatData = data.map((d) => {
        return {
            "ရက်စွဲ": d.seized_date,
            "ယာဉ်အမှတ်": d.vehicle_number,
            "အမျိုးအစား/အရောင်": d.vehicle_types,
            "နေရာ": d.seizure_location,
            "အမည်": d.offender_name,
            "မှတ်ပုံတင်": d?.national_id_number || "မရှိ",
            "အဘအမည်": d.offender_father_name,
            "နေရပ်လိပ်စာ": d.address,
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

    // Write the base64 data to the file
    try {
        await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

        // Share the file
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}
