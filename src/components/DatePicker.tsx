"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

const DatePicker = ({ onSelect, checkIn, checkOut }: { onSelect: (date: Date) => void, checkIn: Date | null, checkOut: Date | null }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const renderCalendar = (month: dayjs.Dayjs) => {
    const totalDays = month.daysInMonth();
    const startDay = month.startOf('month').day();
    const monthDays = [];

    for (let i = 0; i < startDay; i++) {
      monthDays.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = month.date(day);
      const isInRange = checkIn && checkOut && date.isAfter(dayjs(checkIn)) && date.isBefore(dayjs(checkOut));
      const isCheckIn = checkIn && date.isSame(checkIn, "day");
      const isCheckOut = checkOut && date.isSame(checkOut, "day");

      monthDays.push(
        <div
          key={day}
          className={`p-2 text-center cursor-pointer rounded-full ${isCheckIn || isCheckOut ? 'bg-indigo-600 text-white' : isInRange ? 'bg-indigo-100' : 'hover:bg-gray-200'}`}
          onClick={() => onSelect(date.toDate())}
        >
          {day}
        </div>
      );
    }

    return monthDays;
  };

  const prevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-2">
        {checkIn && !checkOut ? 'Select check-out date' : 'Select check-in date'}
      </motion.div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}><ChevronLeft /></button>
        <h2 className="font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={nextMonth}><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={`${day}-${index}`} className="font-bold text-center text-gray-500">{day}</div>
        ))}
        {renderCalendar(currentDate)}
      </div>
    </div>
  );
};

export default DatePicker;
