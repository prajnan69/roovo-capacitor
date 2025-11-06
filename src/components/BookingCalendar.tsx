"use client";

import { useState } from 'react';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const monthDays = [];

    // Placeholders for empty days at the start of the month
    for (let i = 0; i < startDay; i++) {
      monthDays.push(<div key={`empty-${i}`} className="border border-gray-800"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isBooked = day > 10 && day < 15; // Hardcoded example
      const isBlocked = day === 20; // Hardcoded example

      monthDays.push(
        <div
          key={day}
          className={`p-4 border border-gray-800 text-center ${
            isBooked ? 'bg-red-800' : isBlocked ? 'bg-gray-700' : 'bg-gray-900'
          } hover:bg-gray-700 cursor-pointer`}
        >
          {day}
        </div>
      );
    }

    return monthDays;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Availability Calendar</h1>

        <div className="border border-gray-700 bg-gray-900">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <button onClick={prevMonth} className="font-bold text-2xl">{'<'}</button>
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="font-bold text-2xl">{'>'}</button>
          </div>

          <div className="grid grid-cols-7">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 font-bold text-center border-b border-r border-gray-800">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-xl font-bold mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center"><div className="w-4 h-4 bg-red-800 mr-2"></div> Booked</div>
              <div className="flex items-center"><div className="w-4 h-4 bg-gray-700 mr-2"></div> Blocked</div>
              <div className="flex items-center"><div className="w-4 h-4 bg-gray-900 border border-gray-600 mr-2"></div> Available</div>
            </div>
          </div>
          <div className="md:col-span-2 border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Minimum Stay</label>
                <input type="number" defaultValue="2" className="w-full bg-black border border-gray-700 p-2 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Maximum Stay</label>
                <input type="number" defaultValue="30" className="w-full bg-black border border-gray-700 p-2 mt-1" />
              </div>
              <button className="w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
