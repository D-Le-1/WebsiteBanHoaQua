import React from 'react'
import {useState} from "react"

const LikePicker = () => {
    const [like, setLike] = useState(false)
    return (
        <button 
        className={`w-12 h-12 border flex justify-center items-center rounded-md ${
          like ? "text-red-500 border-red-500" : "text-gray-500 border-gray-300"
        }`} 
        onClick={() => setLike(!like)}
      >
        {like ? "❤️" : "🤍"}
      </button>
    );
  };
  
  export default LikePicker;