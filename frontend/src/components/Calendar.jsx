// components/Calendar.js
import CalendarDay from "./CalendarDay";
import { eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, getDay, format } from "date-fns";

const Calendar = ({
  currentDate,
  dateData,
  selectedDate,
  isSelecting,
  selectedDates,
  onDateMouseDown,
  onDateMouseEnter,
  onDateClick,
  onDateTouchStart,
  onDateTouchMove,
  onDateTouchEnd,
}) => {
  const daysOfWeek = ["L", "M", "M", "G", "V", "S", "D"];

  // Genera i giorni per il mese corrente
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Spazi vuoti per l'allineamento
  const emptySlots = (getDay(monthStart) + 6) % 7;

  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-2">
      <div className="grid grid-cols-7 text-center gap-1 text-sm text-white select-none">
        {/* Giorni della settimana */}
        {daysOfWeek.map((day) => (
          <span key={day} className="font-bold">
            {day}
          </span>
        ))}

        {/* Spazi vuoti per l'allineamento */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div key={index}></div>
        ))}

        {/* Date */}
        {daysInMonth.map((date) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const dateKey = format(date, "yyyy-MM-dd");
          const data = dateData[dateKey];
          const isCurrentlySelected = selectedDates.some((d) => isSameDay(d, date));

          return (
            <CalendarDay
              key={dateKey}
              date={date}
              isToday={isToday}
              isSelected={isSelected || isCurrentlySelected}
              data={data}
              onMouseDown={onDateMouseDown}
              onMouseEnter={onDateMouseEnter}
              onClick={onDateClick}
              onTouchStart={onDateTouchStart}
              onTouchMove={onDateTouchMove}
              onTouchEnd={onDateTouchEnd}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
