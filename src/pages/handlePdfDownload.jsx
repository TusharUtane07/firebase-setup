import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generatePDF } from './utilityFunction';


const generateUniqueFilename = (baseFilename) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  return `${timestamp}_${baseFilename}`;
};

export const downloadPDF = async (data, groupedData,filename, measurementUnit, selectedValue) => {
  filename = generateUniqueFilename(filename);

  const pdfData = generatePDF(data, groupedData, measurementUnit, selectedValue);

  const blob = new Blob([pdfData], { type: 'application/pdf' });

  const arrayBuffer = await blob.arrayBuffer();
  const base64Data = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Documents,
    encoding: Encoding.Base64,
  });
};
