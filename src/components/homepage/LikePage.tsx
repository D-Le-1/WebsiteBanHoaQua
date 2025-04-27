import React, { useState } from 'react';

const Wishlist =()=> {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'MacBook Pro M3', price: 1999.99, priority: 'High', image: '/api/placeholder/80/80', purchased: false },
    { id: 2, name: 'Mechanical Keyboard', price: 120.50, priority: 'Medium', image: '/api/placeholder/80/80', purchased: false },
    { id: 3, name: 'Sony Headphones', price: 299.99, priority: 'Low', image: '/api/placeholder/80/80', purchased: false },
    { id: 4, name: 'Smart Watch', price: 249.99, priority: 'Medium', image: '/api/placeholder/80/80', purchased: true },
    { id: 5, name: 'React Course', price: 19.99, priority: 'High', image: '/api/placeholder/80/80', purchased: false },
    { id: 6, name: 'Camera Lens', price: 599.99, priority: 'Low', image: '/api/placeholder/80/80', purchased: false },
    { id: 7, name: 'Gaming Console', price: 499.99, priority: 'Medium', image: '/api/placeholder/80/80', purchased: false },
    { id: 8, name: 'Wireless Earbuds', price: 149.99, priority: 'High', image: '/api/placeholder/80/80', purchased: false }
  ]);

  const togglePurchased = (id) => {
    setWishlistItems(
      wishlistItems.map(item => 
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const priorityColors = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  const totalCost = wishlistItems
    .filter(item => !item.purchased)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
                  <span className="font-medium">{wishlistItems.length}</span> items in wishlist
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">{wishlistItems.filter(item => item.purchased).length}</span> purchased
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total remaining:</p>
                <p className="text-2xl font-bold text-indigo-600">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Wishlist items */}
          <div className="divide-y">
            {wishlistItems.map(item => (
              <div 
                key={item.id} 
                className={`p-4 flex items-center ${item.purchased ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className={`text-lg font-medium ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex-shrink-0 ml-4 space-x-2">
                  <button
                    onClick={() => togglePurchased(item.id)}
                    className={`px-3 py-1 rounded ${
                      item.purchased 
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {item.purchased ? 'Unpurchase' : 'Mark purchased'}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist