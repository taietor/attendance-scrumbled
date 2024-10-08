// components/CalendarDay.js
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";

const CalendarDay = ({
  date,
  isToday,
  isSelected,
  data,
  onMouseDown,
  onMouseEnter,
  onClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const dateKey = format(date, "yyyy-MM-dd");

  const dotColorToBgClass = {
    rosso: "bg-red-500",
    blu: "bg-blue-500",
    giallo: "bg-yellow-500",
    verde: "bg-green-500",
  };

  let borderColorClass = "border-gray-600";

  if (isSelected) {
    borderColorClass = "border-purple-500";
  } else if (isToday) {
    borderColorClass = "border-green-500";
  } else if (data?.work?.dotColor && dotColorToBgClass[data.work.dotColor]) {
    borderColorClass = dotColorToBgClass[data.work.dotColor].replace("bg-", "border-");
  }

  return (
    <div
      key={dateKey}
      data-date={date.getTime()}
      onMouseDown={(e) => onMouseDown(e, date)}
      onMouseEnter={(e) => onMouseEnter(e, date)}
      onClick={() => onClick(date)}
      onTouchStart={(e) => onTouchStart(e, date)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative p-1 rounded-lg cursor-pointer border overflow-hidden ${
        isSelected
          ? "bg-purple-500 text-white border-purple-500"
          : `text-gray-200 ${borderColorClass}`
      } hover:bg-purple-600 transition-colors duration-200`}
      style={{ minHeight: "70px" }}
    >
      {/* Pallino principale in alto a sinistra */}
      {data?.work?.dotColor && (
        <span
          className={`absolute top-1 left-1 h-2 w-2 rounded-full ${
            dotColorToBgClass[data.work.dotColor]
          }`}
        ></span>
      )}

      {/* Contenuto della casella */}
      {!data?.work ? (
        // Nessun dato, numero del giorno centrato
        <span className="text-lg font-bold flex items-center justify-center h-full">
          {format(date, "d")}
        </span>
      ) : (
        // Dati presenti, numero del giorno in alto a destra, informazioni sul progetto e ore
        <>
          <span className="absolute top-0.5 right-0.5 text-xs font-bold">
            {format(date, "d")}
          </span>
          <div className="mt-3 text-xs leading-tight">
            {/* Progetto principale */}
            <p className="truncate font-semibold">{data.work.project}</p>
            <p>
              L: {data.work.workHours}h {data.work.workMinutes}m
            </p>
            {data.work.permessiHours || data.work.permessiMinutes ? (
              <p>
                P: {data.work.permessiHours}h {data.work.permessiMinutes}m
              </p>
            ) : null}
            {data.work.malattiaHours || data.work.malattiaMinutes ? (
              <p>
                M: {data.work.malattiaHours}h {data.work.malattiaMinutes}m
              </p>
            ) : null}
            {data.work.ferieHours || data.work.ferieMinutes ? (
              <p>
                F: {data.work.ferieHours}h {data.work.ferieMinutes}m
              </p>
            ) : null}

            {/* Straordinari */}
            {data.overtime && data.overtime.length > 0 && (
              <div className="mt-2">
                {data.overtime.map((ot, index) => (
                  <p key={index} className="text-xs font-medium text-yellow-300">
                    + {ot.project}: {ot.overtimeHours}h {ot.overtimeMinutes}m
                  </p>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarDay;
