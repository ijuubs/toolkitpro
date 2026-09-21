import { useState } from 'react';

interface ConversionOption {
  key: string;
  label: string;
  rate: number;
}

const CONVERSION_LIST: ConversionOption[] = [
  // Construction & Trades (Length)
  { key: 'ft-m', label: 'Feet to Meters (ft → m)', rate: 0.3048 },
  { key: 'm-ft', label: 'Meters to Feet (m → ft)', rate: 3.28084 },
  { key: 'in-cm', label: 'Inches to Centimeters (in → cm)', rate: 2.54 },
  { key: 'cm-in', label: 'Centimeters to Inches (cm → in)', rate: 0.393701 },
  { key: 'in-mm', label: 'Inches to Millimeters (in → mm)', rate: 25.4 },
  { key: 'mm-in', label: 'Millimeters to Inches (mm → in)', rate: 0.0393701 },
  { key: 'yd-m', label: 'Yards to Meters (yd → m)', rate: 0.9144 },
  { key: 'm-yd', label: 'Meters to Yards (m → yd)', rate: 1.09361 },

  // Temperature
  { key: 'c-f', label: 'Celsius to Fahrenheit (°C → °F)', rate: 1.8 }, // Calculation in handleConvert needs to handle offset for temp
  { key: 'f-c', label: 'Fahrenheit to Celsius (°F → °C)', rate: 0.5556 },

  // Homeowner & Flooring/Roofing (Area)
  { key: 'sqft-sqm', label: 'Square Feet to Square Meters (sq ft → m²)', rate: 0.092903 },
  { key: 'sqm-sqft', label: 'Square Meters to Square Feet (m² → sq ft)', rate: 10.7639 },
  { key: 'acre-sqft', label: 'Acres to Square Feet (acre → sq ft)', rate: 43560 },

  // Distance & Travel
  { key: 'km-m', label: 'Kilometers to Meters (km → m)', rate: 1000 },
  { key: 'm-km', label: 'Meters to Kilometers (m → km)', rate: 0.001 },
  { key: 'mi-km', label: 'Miles to Kilometers (mi → km)', rate: 1.60934 },
  { key: 'km-mi', label: 'Kilometers to Miles (km → mi)', rate: 0.621371 },

  // Weight & Materials
  { key: 'kg-lb', label: 'Kilograms to Pounds (kg → lb)', rate: 2.20462 },
  { key: 'lb-kg', label: 'Pounds to Kilograms (lb → kg)', rate: 0.453592 },
  { key: 'oz-g', label: 'Ounces to Grams (oz → g)', rate: 28.3495 },
  { key: 'g-oz', label: 'Grams to Ounces (g → oz)', rate: 0.035274 },

  // Volume & Liquids
  { key: 'gal-l', label: 'Gallons to Liters (US gal → L)', rate: 3.78541 },
  { key: 'l-gal', label: 'Liters to Gallons (L → US gal)', rate: 0.264172 },
  { key: 'l-ml', label: 'Liters to Milliliters (L → ml)', rate: 1000 },
  { key: 'ml-l', label: 'Milliliters to Liters (ml → L)', rate: 0.001 }
];

export default function UnitConverter() {
  const [val, setVal] = useState('');
  const [type, setType] = useState('ft-m');
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    const option = CONVERSION_LIST.find(o => o.key === type);
    if (!option) return;
    
    if (type === 'c-f') {
        setResult((n * 1.8) + 32);
    } else if (type === 'f-c') {
        setResult((n - 32) * 0.5556);
    } else {
        setResult(n * option.rate);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Value to Convert</label>
          <input 
            type="number" 
            placeholder="e.g. 10" 
            value={val} 
            onChange={(e) => setVal(e.target.value)} 
            className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:border-yellow-400" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Unit Conversion</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border-4 border-black font-bold text-base bg-white focus:outline-none focus:border-yellow-400"
          >
            {CONVERSION_LIST.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleConvert} 
        className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:text-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-4 border-black"
      >
        Calculate Conversion
      </button>

      {result !== null && (
        <div className="p-6 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-wider text-black mb-1">Converted Result</p>
          <p className="text-4xl font-black text-black">{result.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
        </div>
      )}
    </div>
  );
}
