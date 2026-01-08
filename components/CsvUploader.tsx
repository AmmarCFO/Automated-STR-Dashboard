
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';
import { PortfolioStats, Property } from '../types';

interface CsvUploaderProps {
  onDataLoaded: (data: PortfolioStats) => void;
  className?: string;
  label?: string;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onDataLoaded, className, label = "Upload Data" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.split('\n');
      const properties: Property[] = [];

      // Skip header row, start from index 1
      // Expected columns: Name, Total Units, Vacant Units, Revenue Lost
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle quoted CSV values if simple split fails, but simple split usually ok for simple numbers
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        
        if (cols.length < 4) continue;

        const name = cols[0];
        // Parse Total Units
        const totalUnits = parseInt(cols[1].replace(/[^0-9]/g, '')) || 0;
        
        // Parse Vacant Units (handle text like "3 units @ 5000")
        // We just extract the first number found
        const vacantMatch = cols[2].match(/(\d+)/);
        const vacantUnits = vacantMatch ? parseInt(vacantMatch[0]) : 0;

        // Parse Monthly Revenue Lost
        const revenueLost = parseFloat(cols[3].replace(/[^0-9.]/g, '')) || 0;

        // Calculate approximate avg rent for backward compatibility
        // If revenue lost is 0, default to 0. Otherwise (Revenue / Vacant) * 12
        const derivedAvgAnnualRent = vacantUnits > 0 
            ? (revenueLost / vacantUnits) * 12 
            : 0;

        properties.push({
          id: `csv-${i}`,
          name: name || `Property ${i}`,
          totalUnits,
          vacantUnits,
          avgAnnualRent: derivedAvgAnnualRent,
          type: 'Residential', // Defaulting to Residential as type isn't in the 4 columns
          manualMonthlyLeakage: revenueLost
        });
      }

      if (properties.length > 0) {
        onDataLoaded({
            id: 'uploaded-portfolio',
            name: 'Uploaded Portfolio',
            properties
        });
      } else {
          alert('No valid data found in CSV. Please check the format.');
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file.');
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-300 active:scale-95 ${className}`}
      >
        <UploadIcon className="w-5 h-5" />
        <span>{label}</span>
      </button>
    </>
  );
};

export default CsvUploader;
