import Papa from 'papaparse';
import { ChurchData } from '../data';

const SHEET_ID = '1BPp24qyCpqZ2oJB-p3oqL0tHqkahITdl21hGN_AdoQE';
const SHEET_NAME = 'Call Center';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

export async function fetchSheetData(): Promise<ChurchData[]> {
  try {
    // Add a timestamp to bypass browser caching
    const urlWithCacheBuster = `${CSV_URL}&_=${new Date().getTime()}`;
    const response = await fetch(urlWithCacheBuster, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData: ChurchData[] = results.data.map((row: any) => {
            // Helper to safely parse numbers
            const parseNum = (val: string) => {
              if (!val) return 0;
              const parsed = parseFloat(val.replace(/,/g, ''));
              return isNaN(parsed) ? 0 : parsed;
            };

            // Helper to parse percentage
            const parsePercent = (val: string) => {
              if (!val) return 0;
              const parsed = parseFloat(val.replace('%', '').replace(/,/g, ''));
              return isNaN(parsed) ? 0 : parsed;
            };

            return {
              temploZona: row['Templo / Zona'] || 'Desconocido',
              totalLideres: parseNum(row['Total Lideres']),
              lideresConReferidos: parseNum(row['Lideres con Referidos']),
              totalReferidos: parseNum(row['TOTAL REFERIDOS']),
              h9: parseNum(row['9 AM']),
              h10: parseNum(row['10 AM']),
              h11: parseNum(row['11 AM']),
              h12: parseNum(row['12 AM']),
              h13: parseNum(row['1 PM']),
              h14: parseNum(row['2 PM']),
              h15: parseNum(row['3 PM']),
              h16: parseNum(row['4 PM']),
              cierre: parseNum(row['CIERRE']),
              porcentajeAvance: parsePercent(row['% Avance'])
            };
          });
          
          // Filter out rows that might be empty or totals if needed
          // Assuming valid rows have a Templo / Zona
          const validData = parsedData.filter(d => d.temploZona && d.temploZona !== 'Desconocido');
          resolve(validData);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return [];
  }
}
