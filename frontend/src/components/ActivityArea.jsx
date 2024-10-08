// components/ActivityArea.js
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";

const ActivityArea = ({
  selectedDate,
  dateData,
  onEditWork,
  onDeleteWork,
  onEditOvertime,
  onDeleteOvertime,
}) => {
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const data = dateData[dateKey];

  if (!data) {
    return <p className="text-gray-300">Nessuna attività programmata per questa data.</p>;
  }

  return (
    <div className="mt-4 flex-grow overflow-y-auto">
      {/* Progetto principale */}
      {data.work && (
        <div className="bg-gray-800 p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-white">{data.work.project}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditWork(dateKey)}
                className="text-yellow-300 hover:text-yellow-500"
                title="Modifica Progetto"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteWork(dateKey)}
                className="text-red-500 hover:text-red-700"
                title="Elimina Progetto"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Orario: {data.work.workHours}h {data.work.workMinutes}m
          </p>
          {data.work.permessiHours || data.work.permessiMinutes ? (
            <p className="text-sm text-gray-400">
              Permessi: {data.work.permessiHours}h {data.work.permessiMinutes}m
            </p>
          ) : null}
          {data.work.malattiaHours || data.work.malattiaMinutes ? (
            <p className="text-sm text-gray-400">
              Malattia: {data.work.malattiaHours}h {data.work.malattiaMinutes}m
            </p>
          ) : null}
          {data.work.ferieHours || data.work.ferieMinutes ? (
            <p className="text-sm text-gray-400">
              Ferie: {data.work.ferieHours}h {data.work.ferieMinutes}m
            </p>
          ) : null}
        </div>
      )}

      {/* Straordinari */}
      {data.overtime && data.overtime.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-yellow-300">Straordinari</p>
          </div>
          {data.overtime.map((ot, index) => (
            <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
              <div>
                <p className="text-sm text-gray-300">{ot.project}</p>
                <p className="text-sm text-gray-400">
                  {ot.overtimeHours}h {ot.overtimeMinutes}m
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditOvertime(dateKey, index)}
                  className="text-yellow-300 hover:text-yellow-500"
                  title="Modifica Straordinario"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDeleteOvertime(dateKey, index)}
                  className="text-red-500 hover:text-red-700"
                  title="Elimina Straordinario"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityArea;
