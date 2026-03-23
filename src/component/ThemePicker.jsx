import { useState, useEffect , useRef} from "react";
import { allowedColors } from "../constants";
import { colorMap } from "../constants";

export default function ThemePicker({ backgroundColor, textColor, setUserTheme, setBackgroudColor, setTextColor, userTheme, updateProfile}) {
  const [selectedColor, setSelectedColor] = useState(userTheme || allowedColors[0]);
  const [open, setOpen] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

   useEffect(() => {
    if (userTheme) {
      setSelectedColor(userTheme);
    }
  }, [userTheme]);

    const popupRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="rounded-xl py-3 px-5 flex items-center justify-center gap-4 mt-4 relative"
      style={{ background: backgroundColor, border: `1px solid ${textColor}` }}
    >
      {/* Label + selected swatch */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="permanent-marker-light text-[14px]" style={{ color: textColor }}>
          Theme
        </span>
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: colorMap[selectedColor]["background"] || selectedColor, border: `2px solid ${textColor}` }}
        />
        <span className="text-[10px] permanent-marker-ultralight" style={{ color: textColor }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* Save button — only shows when a new color is picked */}
      {hasChanged && (
        <button
          className="permanent-marker-light text-[13px] px-3 py-1 rounded-lg transition-opacity"
          style={{ background: textColor, color: backgroundColor }}
          onClick={() => {
            updateProfile();
            setHasChanged(false);
          }}
        >
          Save ✓
        </button>
      )}

      {/* Color picker popup */}
      {open && (
        <div
          ref={popupRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-xl p-3 flex flex-wrap gap-2 z-50"
          style={{
            background: textColor,
            border: `1px solid ${backgroundColor}`,
            width: '180px',
          }}
        >
          {allowedColors.map((color) => (
            <button
              key={color}
              className="w-7 h-7 rounded-full transition-transform hover:scale-125"
              style={{
                backgroundColor: colorMap[color]["background"],
                border: selectedColor === color
                  ? `3px solid ${backgroundColor}`
                  : `2px solid transparent`,
                outline: selectedColor === color ? `1px solid ${textColor}` : 'none',
              }}
              onClick={() => {
                setSelectedColor(color);
                setUserTheme(color);
                const themeData = colorMap[color];
                setBackgroudColor(themeData.background);
                setTextColor(themeData.textColor);
                setHasChanged(true);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}