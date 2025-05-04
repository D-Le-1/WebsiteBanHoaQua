// src/store/favoriteStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from "react-toastify";

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      // Add a product to favorites
      addFavorite: (product) => {
        if (!product || !product._id) {
          console.error("Cannot add favorite: Product is missing or has no _id");
          return;
        }
        
        const favorites = get().favorites;
        const exists = favorites.some(item => item._id === product._id);
        
        if (!exists) {
          set({ favorites: [...favorites, product] });
          toast.success("❤️ Đã thêm vào danh sách yêu thích!", { 
            position: "top-right",
            autoClose: 2000 
          });
        }
      },
      
      // Remove a product from favorites
      removeFavorite: (productId) => {
        if (!productId) {
          console.error("Cannot remove favorite: No product ID provided");
          return;
        }
        
        set(state => ({
          favorites: state.favorites.filter(item => item._id !== productId)
        }));
        
        toast.info("🖤 Đã xóa khỏi danh sách yêu thích!", { 
          position: "top-right",
          autoClose: 2000 
        });
      },
      
      // Check if a product is in favorites
      isFavorite: (productId) => {
        if (!productId) return false;
        return get().favorites.some(item => item._id === productId);
      },
      
      // Get the count of favorites
      getFavoritesCount: () => get().favorites.length,
      
      // Clear all favorites
      clearFavorites: () => {
        set({ favorites: [] });
        toast.info("Đã xóa tất cả sản phẩm yêu thích!", { 
          position: "top-right" 
        });
      }
    }),
    {
      name: 'favorite-products', // localStorage key
      version: 1, // useful for migrations
    }
  )
);

export default useFavoriteStore;