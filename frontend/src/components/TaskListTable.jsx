import React, {useState, useMemo, useEffect} from "react";
import moment from "moment";

const TaskListTable = ({tableData}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  //  tunggu 500ms setelah user berhenti mengetik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler); // batalkan jika user masih mengetik
  }, [searchTerm]);

  const filteredTasks = useMemo(() => {
    return tableData.filter((task) => task.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [tableData, debouncedSearch]);

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      {/* Input Search */}
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          placeholder="Search task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tabel */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Name</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Status</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Priority</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">Created On</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 text-[13px]">{task.title}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 text-[13px] hidden md:table-cell">
                  {task.createdAt ? moment(task.createdAt).format("Do MMM YYYY") : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-400 py-4 text-sm">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
