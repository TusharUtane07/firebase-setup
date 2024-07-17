import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generateExcel } from './utilityFunction';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';

const generateUniqueFilename = (baseFilename) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  return `${timestamp}_${baseFilename}`;
};

export const downloadExcel = async (data, groupedData, filename, measurementUnit, selectedValue) => {
  filename = generateUniqueFilename(filename);

  const wbout = generateExcel(data, groupedData, measurementUnit, selectedValue);
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

  // Show a toast message
  await Toast.show({
    text: 'File downloaded successfully',
    duration: 'short',
  });

  const getFileUri = async () => {
    try {
      const result = await Filesystem.getUri({
        path: filename,
        directory: Directory.Documents,
      });
      console.log(result.uri)
      const shareOptions = {
        title: 'Share Excel File',
        text: 'Here is the Excel file you downloaded.',
        url: result.uri,
        dialogTitle: 'Share the file'
      };
      await Share.share(shareOptions);

    } catch (e) {
      console.error('Unable to get file URI', e);
      return null;
    }
  };
  
  // Option to share the file


  // Show share dialog after a short delay
  setTimeout(async () => {
    await getFileUri();
  }, 500);
};
