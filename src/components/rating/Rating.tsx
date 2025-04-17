import React from "react"
import { useState } from "react"
import { useProduct } from "../../useQuery/hooks/useProduct"

const Rating = ({ rating, onRatingChange, data }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg cursor-pointer ${
              i < rating ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => onRatingChange(i + 1)}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-600 text-sm">(150 Reviews)</span>
      <span className="text-gray-300">|</span>

      <span className="text-black font-semibold">Stock: {data}</span>
    </div>
  )
}

export default Rating
