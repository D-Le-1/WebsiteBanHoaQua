import React, { useState } from "react"

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  const totalPages = Math.ceil(allProducts.length / productsPerPage)

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = allProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentProducts.map((product, index) => (
          <div key={index} className="border p-2 rounded shadow">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-32 object-cover"
            />
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-green-600">
              {product.salePrice.toLocaleString()}₫
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Trước
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </div>
  )
}

export default Pagination
