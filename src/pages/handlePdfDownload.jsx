import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { generatePDF } from './utilityFunction';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';

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
          title: 'Share Pdf File',
          text: 'Here is the Pdf file you downloaded.',
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
