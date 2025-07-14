import { ImportEnum } from '@/utils/enum/ImportEnum';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import excelDateToJSDate from './excelDatetoJsDate';
import removeSpacesFromKeysAndValues from './removeSpaceKeysAndValues';

function cleanKeysAndValues(data: any[]): any[] {
    return data.map(item => {
        const newItem: any = {};
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const cleanKey = key
                    .replace(/[\n\r]/g, '')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '')
                    .trim();

                let value = item[key];
                if (typeof value === 'string') {
                    value = value.trim();
                }

                newItem[cleanKey] = value;
            }
        }
        return newItem;
    });
}


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

        jsonData = cleanKeysAndValues(jsonData);

        jsonData = jsonData.map(row => ({
            ...row,
            "ရက်စွဲ": typeof row[ImportEnum.Date] === 'number' ? excelDateToJSDate(row[ImportEnum.Date]) : row[ImportEnum.Date],
            "အရေးယူရက်စွဲ": typeof row[ImportEnum.ActionTakenDate] === 'number' ? excelDateToJSDate(row[ImportEnum.ActionTakenDate]) : row[ImportEnum.ActionTakenDate],
        }));


        const cleanedData = removeSpacesFromKeysAndValues(jsonData);
        return cleanedData
    } catch (error) {
        console.error('Excel import error:', error);
        return null;
    }
}