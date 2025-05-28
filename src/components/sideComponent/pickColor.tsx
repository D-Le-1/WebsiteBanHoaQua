import React from 'react'
import {useState} from "react"

const ColorPicker = () => {
    const [selectedColor, setSelectedColor] = useState()

    const colors = ["blue", "red"]
    return (
      <div className="flex items-center space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === color ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    );
  };
  
  export default ColorPicker;