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
      return value * 30.48; // 1 cm = 0.0328084 feet
    case "meter":
      return value * 0.3048; // 1 meter = 3.28084 feet
    case "inch":
      return value * 12; // 1 inch = 0.0833333 feet
    case "feet":
      return value; // 1 feet = 1 feet
    case "mm":
      return value * 304.8; // 1 mm = 0.00328084 feet
  }
};

export const generateExcel = (data, groupedData, measurementUnit, selectedValue) => {
let  sumOfSqft = 0;
let peiceNumberTotal = 0;
const resultsArray = [];
  console.log(measurementUnit)
  if(selectedValue == "1"){
    data?.results?.map((item, index) => {
      const value1 = parseValue(item.multiplication.split("X")[0]);
      const value2 = parseValue(item.multiplication.split("X")[1]);
    
    
      if (isNaN(value1) || isNaN(value2)) {
        console.error("Invalid values:", value1, value2);
        return null;
      }
      const convertedValue1 = convertValue(value1, measurementUnit).toFixed(2);
      const convertedValue2 = convertValue(value2, measurementUnit).toFixed(2);
      let result = ""
    
      if(measurementUnit == "feet"){
        result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);
      }
      else{
        result = (convertedValue1 * convertedValue2).toFixed(2);
      }
      sumOfSqft += Number(result);
      peiceNumberTotal += 1;
    
      const resultObject = {
        Peice: index + 1,
        Length: convertedValue1,
        Breadth: convertedValue2,
        SQFT: result
      };
    
      resultsArray.push(resultObject);
    
      return null;
    });
    const resultObject1 = {
      Peice: "",
      Length: "",
      Breadth: "",
      SQFT: "",
    };
    const resultObject = {
      Peice: "Total Peice " + peiceNumberTotal,
      Length: "",
      Breadth: "Total SQFT",
      SQFT: sumOfSqft
    };
    resultsArray.push(resultObject1);
    resultsArray.push(resultObject);
  }
else if(selectedValue == "2"){
  groupedData.map((group, index) => 
    {

sumOfSqft += Number(group.sqft);
peiceNumberTotal += group.pieceNumbers.length;
const resultObject = {
  Peice: group.pieceNumbers.length,
  Length: group.length,
  Breadth:group.breadth,
  Peice_Number: group.pieceNumbers.join(", "),
  Area: group.sqft,
};
resultsArray.push(resultObject);

}

)
const resultObject1 = {
  Peice: "",
  Length: "",
  Breadth:"",
  Peice_Number: "",
  Area: "",
};
const resultObject = {
  Peice: "Total Peice " + peiceNumberTotal,
  Length: "",
  Breadth:"",
  Peice_Number: "Total SQFT",
  Area:sumOfSqft
};
resultsArray.push(resultObject1);
resultsArray.push(resultObject);
}

data = resultsArray
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(ws['!ref']);
const secondLastRow = range.e.r - 1;
// Apply bold style to the second last row
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: secondLastRow, c: col });
  if (!ws[cellAddress]) continue;
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = { bold: true };
}


  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return wbout;
};



export const generatePDF = (data, groupedData, measurementUnit, selectedValue) => {
  const doc = new jsPDF();
  const resultsArray = [];
	let totalResult = 0;
	let  sumOfSqft = 0;
	let peiceNumberTotal = 0;

  if(selectedValue == "1"){
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
      sumOfSqft += Number(result);
      peiceNumberTotal += 1;
      const resultObject = {
        Piece: index + 1,
        Length: convertedValue1,
        Breadth: convertedValue2,
        SQFT: result
      };
  
      resultsArray.push(resultObject);
    });
  }
  else if(selectedValue == "2"){
    groupedData.map((group, index) => 
      {
  
  sumOfSqft += Number(group.sqft);
  peiceNumberTotal += group.pieceNumbers.length;
  const resultObject = {
    Piece: group.pieceNumbers.length,
    Length: group.length,
    Breadth:group.breadth,
    Peice_Number: group.pieceNumbers.join(", "),
    SQFT: group.sqft,
  };
  resultsArray.push(resultObject);
  
  }
  
  )



  }

  const pageHeight = doc.internal.pageSize.height;
  let y = 10; // Starting y-coordinate

  resultsArray.forEach((item) => {
    if (y + 14 > pageHeight) { // Check if adding the next item will exceed page height
      doc.addPage();
      y = 10; // Reset y-coordinate for new page
    }
    if(selectedValue == "1"){
      doc.text(`Piece: ${item?.Piece} | Length: ${item.Length} | Breadth: ${item.Breadth} | SQFT: ${item.SQFT}`, 10, y);

    }
    else{
      doc.text(`Piece: ${item?.Piece} | Length: ${item.Length} | Breadth: ${item.Breadth} | PIECE NO: ${item.Peice_Number} | SQFT: ${item.SQFT}`, 10, y);

    }
    doc.line(10, y + 5, 150, y + 5);
    y += 14;
  });
  doc.text(`Total Pieces: ${peiceNumberTotal}                     Total SQFT: ${sumOfSqft}`, 10, y);

  return doc.output('arraybuffer');
};