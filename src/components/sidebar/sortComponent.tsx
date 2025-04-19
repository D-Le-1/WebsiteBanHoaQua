function Sort({sortOption, handleSortChange}){
  return(
    <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">
                  Sắp xếp theo:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
            </select>
        </div>
  )
}

export default Sort