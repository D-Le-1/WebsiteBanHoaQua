const CategoryComponent = ({ name }) => {
    return (
      <div className="w-24 h-32 border border-gray-200 shadow-sm rounded-lg p-2 bg-emerald-50 animate-bounce hover:animate-none hover:shadow-md hover:border-orange-300 transition-all duration-300 flex flex-col items-center justify-center group">
          <div className="w-16 h-16 mb-2 overflow-hidden rounded-full">
            <img
              src="/images/istockphoto-995518546-612x612.jpg"
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <p className="text-sm font-medium text-gray-800 text-center group-hover:text-orange-500 transition-colors duration-300">
            {name}
          </p>
        </div>
    )
  }

export default CategoryComponent