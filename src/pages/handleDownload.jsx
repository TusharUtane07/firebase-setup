import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generateExcel } from './utilityFunction';

export const downloadExcel = async (data, filename) => {
  const wbout = generateExcel(data);

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
