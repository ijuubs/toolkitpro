import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) setBmi(w / (h * h));
  };

  const getCategory = (val: number) => {
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal weight';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const shareSummary = bmi !== null ? `BMI Health Analysis (ToolKitPro):
• BMI Score: ${bmi.toFixed(1)}
• Category: ${getCategory(bmi)}
• Weight: ${weight} kg
• Height: ${height} cm` : '';

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Weight (kg)</label>
          <input 
            type="number" 
            placeholder="70" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            className="w-full p-4 border-4 border-black font-black text-2xl" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Height (cm)</label>
          <input 
            type="number" 
            placeholder="175" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            className="w-full p-4 border-4 border-black font-black text-2xl" 
          />
        </div>
      </div>
      
      <button 
        onClick={calculate} 
        className="w-full py-4 bg-black text-white font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer"
      >
        Analyze BMI
      </button>

      {bmi !== null && (
        <div className="p-6 md:p-8 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase text-[var(--muted)]">Result</p>
            <ShareResultActions
              title="BMI Health Analysis"
              summary={shareSummary}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <span className="text-5xl sm:text-6xl font-black leading-none">{bmi.toFixed(1)}</span>
            <span className="inline-block text-xl sm:text-2xl font-bold uppercase px-4 py-1.5 bg-yellow-200 border-2 border-black max-w-max">
                {getCategory(bmi)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
