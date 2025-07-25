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

export async function pickAndParseExcelFiles(files: any): Promise<any[]> {
    const allData: any[] = [];

    for (const file of files) {
        try {
            const base64Data = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const workbook = XLSX.read(base64Data, { type: 'base64' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

            jsonData = cleanKeysAndValues(jsonData);

            jsonData = jsonData.map(row => ({
                ...row,
                "ရက်စွဲ": typeof row[ImportEnum.Date] === 'number' ? excelDateToJSDate(row[ImportEnum.Date]) : row[ImportEnum.Date],
                "အရေးယူရက်စွဲ": typeof row[ImportEnum.ActionTakenDate] === 'number' ? excelDateToJSDate(row[ImportEnum.ActionTakenDate]) : row[ImportEnum.ActionTakenDate],
            }));

            const cleanedData = removeSpacesFromKeysAndValues(jsonData);

            allData.push(...cleanedData);
        } catch (error) {
            console.error(`Failed to parse file ${file.name}:`, error);
        }
    }

    // Sort by ရက်စွဲ ascending
    allData.sort((a, b) => {
        const dateA = new Date(a["ရက်စွဲ"]);
        const dateB = new Date(b["ရက်စွဲ"]);

        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateA.getTime() - dateB.getTime();
    });

    return allData;
}


/**
 * This helper picks multiple Excel files and returns their parsed combined data.
 */
export async function pickMultipleAndParseExcelFiles(): Promise<any[] | null> {
    try {
        const fileResult = await DocumentPicker.getDocumentAsync({
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            copyToCacheDirectory: true,
            multiple: true,   // Enable multiple selection
        });

        if (fileResult.canceled || !fileResult.assets?.length) return null;

        // fileResult.assets is an array of selected files
        const parsedData = await pickAndParseExcelFiles(fileResult.assets);

        return parsedData;
    } catch (error) {
        console.error('Excel import error:', error);
        return null;
    }
}
