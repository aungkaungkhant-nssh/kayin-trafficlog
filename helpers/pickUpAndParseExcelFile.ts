import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import excelDateToJSDate from './excelDatetoJsDate';
import removeSpacesFromKeysAndValues from './removeSpaceKeysAndValues';


export async function pickAndParseExcelFile(): Promise<any[] | null> {
    try {
        const fileResult = await DocumentPicker.getDocumentAsync({
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            copyToCacheDirectory: true,
        });

        if (fileResult.canceled || !fileResult.assets?.length) return null;

        const file = fileResult.assets[0];

        // Read file content as base64 string
        const base64Data = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Parse Excel workbook and get first worksheet
        const workbook = XLSX.read(base64Data, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Convert Excel serial dates in specific fields
        jsonData = jsonData.map(row => ({
            ...row,
            "ရက်စွဲ": typeof row["ရက်စွဲ"] === 'number' ? excelDateToJSDate(row["ရက်စွဲ"]) : row["ရက်စွဲ"],
            "အရေးယူရက်စွဲ": typeof row["အရေးယူရက်စွဲ"] === 'number' ? excelDateToJSDate(row["အရေးယူရက်စွဲ"]) : row["အရေးယူရက်စွဲ"],
        }));


        const cleanedData = removeSpacesFromKeysAndValues(jsonData);
        return cleanedData
    } catch (error) {
        console.error('Excel import error:', error);
        return null;
    }
}