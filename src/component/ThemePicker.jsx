import { useState } from "react";

const colors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFC0CB", // Pink
  "#FFA500", // Orange
  "#FFFFF0", // Off-white
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFC0CB", // Pink
  "#FFA500", // Orange
  "#FFFFF0",
];

export default function ThemePicker() {
  const [selectedColor, setSelectedColor] = useState(colors[3]);
  const [open , setOpen] = useState(false)

  return (
    <div className="bottom-4 bg-white shadow-lg rounded-lg py-4  px-6 flex items-center justify-center gap-[20px] mt-4 ">
      <span className="permanent-marker-light text-pink-500" onClick={() => setOpen(!open)} >Select Theme Color:</span>
      <div
        className="w-6 h-6 rounded-full border-2 border-gray-300"
        style={{ backgroundColor: selectedColor }}
      ></div>

      {/* Color options */}
      {open && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 flex space-x-2 transition-all duration-300 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${
                selectedColor === color ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color);
                setOpen(false);
              }}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
