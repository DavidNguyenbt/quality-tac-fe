import {useCallback, useState} from "react";
import * as XLSX from 'xlsx';
import {format} from 'date-fns';

export interface Product {
    ProductCode: string;
    Quantity: number;
    AW: string;
}

export interface GroupedData {
    PONo: string;
    PIDate: string;
    FactoryCode: string;
    Product: Product[];
}

export const processExcelData = async (rawData: any[][]) => {
    const rows = rawData.slice(1);

    const groupedData: { [key: string]: GroupedData } = {};
    const convertDate = (date: any) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
      };
    try {     
        rows.forEach((row) => {
            if(row.length === 0) return Object.values(groupedData);
            const aw = row[0];
            const factoryCode = row[1];
            const poNo = row[2];
            const productCode = row[3];
            const quantity = parseInt(row[4], 10);
            const piDateExcel = row[5];
            // const piDate = format(new Date(Math.round((piDateExcel - (25567 + 2)) * 86400 * 1000)), 'yyyy-MM-dd');
            const piDate = convertDate(piDateExcel);
    
            const key = `${poNo}-${factoryCode}`;
    
            if (!groupedData[key]) {
                groupedData[key] = {
                    PONo: poNo,
                    PIDate: piDate,
                    FactoryCode: factoryCode,
                    Product: [],
                };
            }
    
            groupedData[key].Product.push({
                ProductCode: productCode,
                Quantity: quantity,
                AW: aw,
            });
    
        });
        return Object.values(groupedData);
    } catch (error) {
        return await Promise.reject(error);
    }
};

const useExcelData = () => {
    const [data, setData] = useState<any[][]>([]);
    const [error, setError] = useState<string | null>(null);

    const readExcelFile = useCallback((file: File): Promise<any[][]> => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const arrayBuffer = e.target.result;
                    const workbook = XLSX.read(arrayBuffer, {type: 'array'});
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, {header: 1});

                    setData(jsonData);
                    resolve(jsonData);
                };
                reader.onerror = (error) => {
                    setError('Error reading file');
                    console.error('Error reading file:', error);
                    reject(error);
                };
                reader.readAsArrayBuffer(file);
            } catch (err) {
                setError('Error processing file');
                console.error('Error processing file:', err);
                reject(err);
            }
        });
    }, []);
    return {data, error, readExcelFile};
};

export default useExcelData;