import { useState } from "react";

interface QuantiSelectProps {
  quantity: number;
  stock: number; // Số lượng hàng trong kho
  onQuantityChange: (newQuantity: number) => void;
}

const QuantitySelector: React.FC<QuantiSelectProps> = ({ quantity, stock, onQuantityChange }) => {
  // Kiểm tra nếu quantity đạt đến stock để vô hiệu hóa nút "+"
  const isMaxQuantity = quantity >= stock;

  return (
    <div className="flex items-center rounded-md border w-32">
      <button
        className="w-8 h-11 border-r bg-red-300 rounded-l-md text-white flex justify-center items-center disabled:bg-gray-300"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1} // Vô hiệu hóa nút "-" khi quantity = 1
      >
        -
      </button>
      <span className="w-16 text-center">{quantity}</span>
      <button
        className="w-8 h-11 bg-red-300 text-white rounded-r-md flex justify-center items-center disabled:bg-gray-300"
        onClick={() => {
          if (quantity < stock) {
            onQuantityChange(quantity + 1);
          }
        }}
        disabled={isMaxQuantity} // Vô hiệu hóa nút "+" khi quantity >= stock
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;