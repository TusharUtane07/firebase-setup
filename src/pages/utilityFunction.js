import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';


const parseValue = (value) => {
    // Replace "'" with ".", "-" with "."
    value = value?.replace(/'/g, ".")?.replace(/"/g, "");

    // If value contains "-", treat it as decimal point
    if (value?.includes("-")) {
        // Replace "-" with "." to convert it into decimal
        value = value?.replace("-", ".");
    }

    // Parse value into float
    return parseFloat(value);
};

const convertValue = (value, unit) => {
  switch (unit) {
    case "cm":
      return value / 10;
    case "meter":
      return value / 1000;
    case "inch":
      return value / 25.4;
    case "feet":
      return value / 304.8;
    default:
      return value;
  }
};

export const generateExcel = (data, measurementUnit) => {
const resultsArray = [];

data?.results?.map((item, index) => {
	const value1 = parseValue(item.multiplication.split("X")[0]);
	const value2 = parseValue(item.multiplication.split("X")[1]);

	if (isNaN(value1) || isNaN(value2)) {
		console.error("Invalid values:", value1, value2);
		return null;
	}
  const convertedValue1 = convertValue(value1, measurementUnit);
  const convertedValue2 = convertValue(value2, measurementUnit);
  const result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);

	// const result = ((value1 * value2) / 144).toFixed(2);

	const resultObject = {
		Peice: index + 1,
		Length: convertedValue1,
		Breadth: convertedValue2,
		SQFT: result
	};

	resultsArray.push(resultObject);

	return null;
});

console.log(resultsArray)
data = resultsArray

  // Create a new workbook
  console.log("aasd")

  const wb = XLSX.utils.book_new();
  console.log("aasd")

  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  console.log("aasd")

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  console.log("aasd")

  // Generate the Excel file
  console.log("a")
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return wbout;
};



export const generatePDF = (data, measurementUnit) => {
  const doc = new jsPDF();
  const resultsArray = [];

  data?.results?.forEach((item, index) => {
    const value1 = parseValue(item.multiplication.split("X")[0]);
    const value2 = parseValue(item.multiplication.split("X")[1]);

    if (isNaN(value1) || isNaN(value2)) {
      console.error("Invalid values:", value1, value2);
      return null;
    }

    const convertedValue1 = convertValue(value1, measurementUnit);
    const convertedValue2 = convertValue(value2, measurementUnit);
    const result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);

    const resultObject = {
      Piece: index + 1,
      Length: convertedValue1,
      Breadth: convertedValue2,
      SQFT: result
    };

    resultsArray.push(resultObject);
  });

  const pageHeight = doc.internal.pageSize.height;
  let y = 10; // Starting y-coordinate

  resultsArray.forEach((item) => {
    if (y + 45 > pageHeight) { // Check if adding the next item will exceed page height
      doc.addPage();
      y = 10; // Reset y-coordinate for new page
    }

    doc.text(`Piece: ${item.Piece}`, 10, y);
    doc.text(`Length: ${item.Length}`, 10, y + 10);
    doc.text(`Breadth: ${item.Breadth}`, 10, y + 20);
    doc.text(`SQFT: ${item.SQFT}`, 10, y + 30);
    doc.line(10, y + 35, 200, y + 35);
    y += 45; // Move y-coordinate for next item
  });

  return doc.output('arraybuffer');
};