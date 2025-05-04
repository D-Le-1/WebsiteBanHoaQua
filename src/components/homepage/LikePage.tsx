import React, { useState } from 'react';
import Sidebar from '../sidebar/sideBar';
import { Link } from 'react-router-dom';
import useFavoriteStore from '../../zustand/store/wishListStore';
import { useTranslation } from 'react-i18next';

const Wishlist = () => {
  const { t } = useTranslation();
  const { favorites, removeFavorite, clearFavorites } = useFavoriteStore();
  const [purchasedItems, setPurchasedItems] = useState({});

  // Define priority colors
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };

  // Calculate total cost of unpurchased items
  const totalCost = favorites
    .filter(item => !purchasedItems[item._id])
    .reduce((sum, item) => sum + (item.salePrice || 0), 0);

  // Toggle purchased status
  const togglePurchased = (itemId) => {
    setPurchasedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <div className="space-x-2">
        <span className="text-sm text-zinc-500">Home /</span>
        <span className="text-sm">My Wishlist</span>
      </div>
      <div className="flex space-x-44">
        <Sidebar/>
        <div className="mx-auto w-full">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
            </div>
            
            {/* Summary */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">{favorites.length}</span> items in wishlist
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">
                      {Object.values(purchasedItems).filter(Boolean).length}
                    </span> purchased
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total remaining:</p>
                  <p className="text-2xl font-bold text-indigo-600">{totalCost.toFixed(2)}₫</p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {favorites.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-lg text-gray-500">Your wishlist is empty</p>
                <p className="text-gray-400 mt-2">Items you add to your wishlist will appear here</p>
              </div>
            )}

            {/* Wishlist items */}
            <div className="divide-y">
              {favorites?.map(item => (
                <div 
                  key={item._id} 
                  className={`p-4 flex items-center ${purchasedItems[item._id] ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      crossOrigin="anonymous"
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className={`text-lg font-medium ${purchasedItems[item._id] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        <Link to={`/productdetail/${item._id}`}>{item.name}</Link>
                      </h3>
                      {item.priority && (
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${priorityColors[item.priority] || priorityColors.medium}`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{(item.salePrice || 0).toFixed(2)}₫</p>
                  </div>
                  <div className="flex-shrink-0 ml-4 space-x-2">
                    <button
                      onClick={() => togglePurchased(item._id)}
                      className={`px-3 py-1 rounded ${
                        purchasedItems[item._id] 
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {purchasedItems[item._id] ? 'Unpurchase' : 'Mark purchased'}
                    </button>
                    <button
                      onClick={() => removeFavorite(item._id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear wishlist button - only show if there are items */}
            {favorites.length > 0 && (
              <div className="p-4 bg-gray-50 border-t">
                <button
                  onClick={clearFavorites}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Clear Wishlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;