import Papa from 'papaparse';

export function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const results = Papa.parse(data, { header: true, skipEmptyLines: true });
      resolve(results.data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}