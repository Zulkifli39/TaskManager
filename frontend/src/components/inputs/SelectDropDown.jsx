import React, {useState} from "react";
import {LuChevronDown, LuChevronUp} from "react-icons/lu";

const SelectDropDown = ({options, value, onChange, placeholder}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Tombol utama dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black outline-none border border-slate-200 px-3 py-2.5 rounded-md mt-2 flex justify-between items-center">
        <span>{value ? options.find((opt) => opt.value === value)?.label : placeholder || "Pilih..."}</span>
        <span className="ml-2">{isOpen ? <LuChevronUp /> : <LuChevronDown />}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-200 rounded-md mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 ${
                option.value === value ? "bg-slate-50 font-medium" : ""
              }`}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
