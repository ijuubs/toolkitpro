import { useState } from 'react';
import ShareResultActions from '../ShareResultActions';

export default function FijiAnnualLeaveCalculator() {
  const [balance, setBalance] = useState<string>('12'); // starting balance
  const [requested, setRequested] = useState<string>('5'); // days requested
  const [startDateStr, setStartDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);

  // Helper function to calculate return to work date
  const calculateResult = () => {
    const balNum = parseFloat(balance) || 0;
    const reqNum = parseFloat(requested) || 0;
    
    // Remaining leave
    const remaining = Math.max(0, balNum - reqNum);

    if (!startDateStr) return { remaining, returnDate: null };

    let currentDate = new Date(startDateStr);
    let daysAdded = 0;

    // We count requested days as leave days. Return date is the first working day after leave days have concluded
    // Under standard workplace policy, your leave consists of N working days.
    // So we iterate day-by-day to find the actual days off first.
    let workingDaysOff = 0;
    while (workingDaysOff < reqNum) {
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (!excludeWeekends || !isWeekend) {
        workingDaysOff++;
      }
      
      // Advance to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // After workingDaysOff have been accrued, we check if the return date itself lands on a weekend.
    // If it does, advance return date to the next Monday
    if (excludeWeekends) {
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return {
      remaining,
      returnDate: currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const results = calculateResult();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Annual Leave & Return Tracker</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Current Leave Balance (Days)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-black uppercase mb-1">Leave Days Requested (Days)</label>
            <input
              type="number"
              value={requested}
              onChange={(e) => setRequested(e.target.value)}
              min="0"
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100"
              placeholder="5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1">Leave Start Date</label>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full p-3 border-4 border-black font-black text-lg focus:outline-none focus:bg-yellow-100 bg-white"
            />
          </div>
          <div className="flex items-center pt-2 sm:pt-6">
            <label className="flex items-center gap-3 cursor-pointer user-select-none">
              <input
                type="checkbox"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                className="w-6 h-6 border-4 border-black bg-white checked:bg-yellow-400 focus:ring-0 cursor-pointer"
              />
              <span className="font-black uppercase text-sm">Exclude Weekends from Leave Days</span>
            </label>
          </div>
        </div>

        <p className="text-xs font-bold text-gray-600 mb-2">
          Under Fiji ERP Section 59, standard annual leave is continuous and usually accrues at a rate of at least 10 working days off per calendar year.
        </p>
      </div>

      {results && (
        <div className="border-4 border-black bg-yellow-100 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
            <h3 className="font-black uppercase text-xl">Leave Calculation Summary</h3>
            <ShareResultActions
              title="Fiji Annual Leave Entitlement"
              summary={`Fiji Annual Leave Entitlement (ToolKitPro):
• Remaining Leave Balance: ${results.remaining} ${results.remaining === 1 ? 'Day' : 'Days'}
• Leave Days Requested: ${requested} Days
• Initial Balance: ${balance} Days
• Leave Start Date: ${startDateStr}${results.returnDate ? `\n• Return-To-Work Date: ${results.returnDate}` : ''}
• Weekends Excluded: ${excludeWeekends ? 'Yes' : 'No'}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-black uppercase text-gray-600 block">Remaining Leave Balance</span>
              <span className="text-3xl sm:text-4xl font-black text-black">
                {results.remaining} {results.remaining === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            {results.returnDate && (
              <div>
                <span className="text-xs font-black uppercase text-gray-600 block">Estimated Return-To-Work Date</span>
                <span className="text-lg sm:text-xl font-black text-emerald-800 bg-white border-2 border-black p-2 inline-block mt-1">
                  {results.returnDate}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
