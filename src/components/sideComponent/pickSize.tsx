import React from 'react'
import {useState} from "react"

const SizePicker = () => {
    const [selectedSize, setSelectedSize] = useState()

    const sizes = ["XS", "S", "M", "L", "XL"]
    return (
      <div className="flex items-center space-x-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`w-6 h-6 rounded-lg border-2 text-sm ${
              selectedSize === size ? "border-black" : ""
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    );
  };
  
  export default SizePicker;