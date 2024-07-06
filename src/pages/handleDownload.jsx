import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generateExcel } from './utilityFunction';


const generateUniqueFilename = (baseFilename) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  return `${timestamp}_${baseFilename}`;
};
export const downloadExcel = async (data, groupedData ,filename, measurementUnit, selectedValue) => {

  filename = generateUniqueFilename(filename);

  const wbout = generateExcel(data, groupedData, measurementUnit, selectedValue);
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const arrayBuffer = await blob.arrayBuffer();
  const base64Data = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  console.log("Testing")
  await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Documents,
    encoding: Encoding.Base64,
  });
};
