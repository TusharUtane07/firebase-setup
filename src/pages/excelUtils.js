import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const downloadExcel = (data, filename) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate a buffer from the workbook
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Use FileSaver to save the file
    saveAs(blob, `${filename}.xlsx`);
};
