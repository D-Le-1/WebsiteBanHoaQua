import React from 'react';
import { Leaf, Sun, Cloud, Snowflake, Loader2, AlertCircle } from 'lucide-react';
import { useProduct } from '../../useQuery/hooks/useProduct';

const seasonalMap = {
  'Mùa Hè': ['dưa hấu', 'xoài', 'thanh long', 'chôm chôm', 'nhãn'],
  'Mùa Thu': ['hồng', 'bưởi', 'nho', 'táo'],
  'Mùa Đông': ['cam', 'quýt', 'dâu tây', 'kiwi'],
  'Mùa Xuân': ['mận', 'vải', 'sầu riêng', 'dưa lưới'],
};

const SeasonalSuggestions = () => {
  // Mock hook for demonstration - replace with your actual useProduct hook
  const { data: products, isLoading, error } = useProduct();

  const seasonIcons = {
    'Mùa Xuân': <Leaf className="w-8 h-8 text-green-500" />,
    'Mùa Hè': <Sun className="w-8 h-8 text-yellow-500" />,
    'Mùa Thu': <Cloud className="w-8 h-8 text-orange-500" />,
    'Mùa Đông': <Snowflake className="w-8 h-8 text-blue-500" />
  };

  const seasonColors = {
    'Mùa Xuân': 'from-green-100 to-emerald-50 border-green-200',
    'Mùa Hè': 'from-yellow-100 to-amber-50 border-yellow-200',
    'Mùa Thu': 'from-orange-100 to-red-50 border-orange-200',
    'Mùa Đông': 'from-blue-100 to-cyan-50 border-blue-200'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
            <h2 className="text-3xl font-bold text-green-700">Gợi ý theo mùa</h2>
          </div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu sản phẩm...</p>
          
          {/* Loading skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-100 rounded-xl"></div>
                  <div className="h-12 bg-gray-100 rounded-xl"></div>
                  <div className="h-8 bg-gray-100 rounded-xl w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500 mr-3" />
            <h2 className="text-3xl font-bold text-red-700">Oops! Có lỗi xảy ra</h2>
          </div>
          <p className="text-gray-600 text-lg mb-6">
            Không thể tải được danh sách sản phẩm. Vui lòng thử lại sau.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const getSeededRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Get current date as seed (YYYY-MM-DD format)
  const today = new Date().toISOString().split('T')[0];
  const dateSeed = today.split('-').reduce((acc, num) => acc + parseInt(num), 0);

  // Shuffle array with seeded random
  const shuffleArray = (array, seed) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(getSeededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
  };

  // Filter products by season based on name and shuffle daily
  const groupedBySeason = Object.entries(seasonalMap).reduce((acc, [season, keywords]) => {
    const seasonProducts = products?.products?.filter(product =>
      keywords.some(keyword => product.name.toLowerCase().includes(keyword))
    ) || [];
    
    // Shuffle products with date-based seed for consistent daily order
    const seasonSeed = dateSeed + season.charCodeAt(0);
    acc[season] = shuffleArray(seasonProducts, seasonSeed);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-16 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-200/25 rounded-full blur-lg"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Gợi ý theo mùa
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những sản phẩm tươi ngon phù hợp với từng mùa trong năm
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(groupedBySeason).map(([season, seasonProducts]) => (
            <div 
              key={season} 
              className={`bg-gradient-to-br ${seasonColors[season]} border-2 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 relative overflow-hidden group`}
            >
              {/* Card decoration */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-sm group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {season}
                  </h3>
                  <div className="transform group-hover:rotate-12 transition-transform duration-300">
                    {seasonIcons[season]}
                  </div>
                </div>

                {seasonProducts.length ? (
                  <div className="space-y-3">
                    {seasonProducts.slice(0, 4).map((product) => (
                      <div 
                        key={product._id}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-3 hover:bg-white/90 transition-all duration-200 border border-white/30 group/item cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 mr-2">
                            <span className="font-medium text-gray-800 text-sm block group-hover/item:text-green-700 transition-colors">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-3 border-t border-white/30">
                      <p className="text-xs text-gray-600 text-center">
                        {seasonProducts.length} sản phẩm
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200/50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      Sản phẩm sẽ có sớm
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Đang chuẩn bị cho mùa này
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalSuggestions;