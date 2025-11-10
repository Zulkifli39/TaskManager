import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // ✅ Tambah item checklist
  const handleAddOption = () => {
    if (option.trim()) {
      const newItem = { title: option, completed: false }; // <== Sesuai schema backend
      setTodoList([...todoList, newItem]);
      setOption("");
    }
  };

  // 🗑️ Hapus item checklist
  const handleDeleteOption = (index) => {
    const updatedList = todoList.filter((_, i) => i !== index);
    setTodoList(updatedList);
  };

  return (
    <div>
      {/* List Todo Items */}
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-black text-xs">
            <span className="text-xs text-black-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
          </p>
          <p className="text-black text-xs flex-1">{item.title}</p>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Input + Add Button */}
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          className="w-full text-[13px] text-black outline-none bg-white border border-slate-300 px-2.5 py-3 rounded-md"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        />
        <button
          className="card-btn text-nowrap flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
