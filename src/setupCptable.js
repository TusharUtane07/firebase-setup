
import * as XLSX from 'xlsx';
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';

// Ensure XLSX can access cptable
XLSX.utils.cptable = cptable;
XLSX.set_cptable(cptable);