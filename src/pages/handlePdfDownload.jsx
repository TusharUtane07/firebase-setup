import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generatePDF } from './utilityFunction';

export const downloadPDF = async (data, filename) => {
  const pdfData = generatePDF(data);

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
