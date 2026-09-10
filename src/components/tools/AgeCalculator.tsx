import { useState, useEffect } from 'react';

export default function AgeCalculator() {
  const [dob, setDob] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!dob || !currentDate) {
      setResults(null);
      return;
    }

    const birthDate = new Date(dob);
    const targetDate = new Date(currentDate);

    if (targetDate < birthDate) {
      setResults({ error: 'Current date must be after Date of Birth' });
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get days in the previous month
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const diffTime = Math.abs(targetDate.getTime() - birthDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Approximation for weeks
    const totalWeeks = Math.floor(totalDays / 7);

    setResults({
      years,
      months,
      days,
      totalMonths,
      totalDays,
      totalWeeks
    });

  }, [dob, currentDate]);

  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Age at the Date Of</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
            />
          </div>
        </div>
      </div>

      {results && results.error && (
        <div className="bg-red-200 border-4 border-black p-4 text-center font-bold">
          {results.error}
        </div>
      )}

      {results && !results.error && (
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4 text-center">Precise Age</h2>
          
          <div className="bg-white border-4 border-black p-6 text-center mb-6">
             <div className="text-3xl sm:text-4xl font-black">
               {results.years} <span className="text-xl text-gray-600">years</span> {results.months} <span className="text-xl text-gray-600">months</span> {results.days} <span className="text-xl text-gray-600">days</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black border-4 border-black p-4 text-center text-white">
              <div className="text-sm font-bold uppercase text-neutral-300 mb-1">Total Months</div>
              <div className="text-2xl font-black">{results.totalMonths.toLocaleString()}</div>
            </div>
            <div className="bg-black border-4 border-black p-4 text-center text-white">
              <div className="text-sm font-bold uppercase text-neutral-300 mb-1">Total Weeks</div>
              <div className="text-2xl font-black">{results.totalWeeks.toLocaleString()}</div>
            </div>
            <div className="bg-black border-4 border-black p-4 text-center text-white">
              <div className="text-sm font-bold uppercase text-neutral-300 mb-1">Total Days</div>
              <div className="text-2xl font-black">{results.totalDays.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
