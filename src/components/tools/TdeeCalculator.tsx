import { useState } from 'react';

export default function TdeeCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(30);
  const [weight, setWeight] = useState<number | ''>(75); // kg
  const [height, setHeight] = useState<number | ''>(175); // cm
  const [activity, setActivity] = useState<number>(1.2);

  const activityLevels = [
    { value: 1.2, label: 'Sedentary (office job)' },
    { value: 1.375, label: 'Light Exercise (1-2 days/week)' },
    { value: 1.55, label: 'Moderate Exercise (3-5 days/week)' },
    { value: 1.725, label: 'Heavy Exercise (6-7 days/week)' },
    { value: 1.9, label: 'Athlete (2x per day)' }
  ];

  const calculateTDEE = () => {
    if (age === '' || weight === '' || height === '') return null;
    if (age <= 0 || weight <= 0 || height <= 0) return null;

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activity;

    return { bmr, tdee };
  };

  const results = calculateTDEE();

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">Your Metrics</h2>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setGender('male')}
            className={`flex-1 border-4 border-black p-3 font-black uppercase transition-all ${gender === 'male' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Male
          </button>
          <button
            onClick={() => setGender('female')}
            className={`flex-1 border-4 border-black p-3 font-black uppercase transition-all ${gender === 'female' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Female
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Age (Years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            className="w-full border-4 border-black p-3 font-bold bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all appearance-none cursor-pointer"
          >
            {activityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results && (
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4 text-center">Your Energy Needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border-4 border-black p-4 text-center">
              <div className="text-sm font-bold uppercase text-neutral-800 dark:text-neutral-200 mb-1">BMR (Basal Metabolic Rate)</div>
              <div className="text-3xl font-black">{Math.round(results.bmr).toLocaleString()}</div>
              <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1 uppercase">Calories / Day (At Rest)</div>
            </div>
            <div className="bg-black border-4 border-black p-4 text-center text-white">
              <div className="text-sm font-bold uppercase text-yellow-400 mb-1">TDEE (Maintenance)</div>
              <div className="text-4xl font-black">{Math.round(results.tdee).toLocaleString()}</div>
              <div className="text-xs font-bold text-neutral-300 mt-1 uppercase">Calories / Day (Active)</div>
            </div>
          </div>
          
          <div className="mt-6 bg-white border-4 border-black p-4">
             <h3 className="font-black uppercase mb-2">Goal Targets:</h3>
             <div className="flex justify-between items-center border-b-2 border-gray-100 py-2">
               <span className="font-bold text-sm">Weight Loss (-500 kcal)</span>
               <span className="font-black text-red-600">{Math.round(results.tdee - 500).toLocaleString()} kcal</span>
             </div>
             <div className="flex justify-between items-center border-b-2 border-gray-100 py-2">
               <span className="font-bold text-sm">Maintenance</span>
               <span className="font-black">{Math.round(results.tdee).toLocaleString()} kcal</span>
             </div>
             <div className="flex justify-between items-center py-2">
               <span className="font-bold text-sm">Muscle Gain (+500 kcal)</span>
               <span className="font-black text-green-600">{Math.round(results.tdee + 500).toLocaleString()} kcal</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
