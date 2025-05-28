import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
const StarRating = ({ averageRating }) => {
    return (
        <p className="text-sm text-gray-500 flex items-center">
            {[...Array(5)].map((_, i) =>
                i < Math.round(averageRating) ? (
                <FaStar key={i} className="text-yellow-400" />
                ) : (
                <FaRegStar key={i} className="text-yellow-400" />
                )
            )}
        </p>
    )
}

export default StarRating;