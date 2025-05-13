import React, { useEffect , useState } from "react";
import { Menu, X, User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const [active, setActive] = useState("My Profile");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const accountMenuItems = [
    { name: t("my_account.profile.title"), path: "/profile", icon: <User size={18} /> },
    { name: t("my_account.orders.title"), path: "/orders", icon: <ShoppingBag size={18} /> },
    { name: t("my_account.wishlist.title"), path: "/wishlist", icon: <Heart size={18} /> },
  ];

  const settingsMenuItems = [
    { name: t("my_account.logout"), path: "/logout", icon: <LogOut size={18} /> },
  ];

  const MenuItem = ({ item }) => {
    return (
      <a
        href={item.path}
        onClick={(e) => {
          // Chỉ cập nhật trạng thái active và đóng sidebar
          setActive(item.name);
          setIsOpen(false);
          // Không gọi e.preventDefault() để cho phép điều hướng
        }}
        className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
          active === item.name
            ? "bg-red-50 text-red-600 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className={`mr-3 ${active === item.name ? "text-red-600" : "text-gray-500"}`}>
          {item.icon}
        </span>
        <span>{item.name}</span>
        {active === item.name && (
          <span className="ml-auto w-1 h-5 bg-red-600 rounded-full"></span>
        )}
      </a>
    );
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">{t("my_account.title")}</h2>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div 
        className={`
          absolute md:static w-full md:w-64 bg-white shadow-lg md:shadow-none z-10
          transition-all duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"}
          rounded-lg md:rounded-none border md:border-r border-gray-200 overflow-hidden
        `}
      >
        <div className="hidden md:block p-6 border-b">
          <h2 className="text-xl font-bold">{t("my_account.title")}</h2>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-4 px-4">
            {t("my_account.manager")}
          </h3>
          <div className="space-y-1">
            {accountMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </div>
          
          <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-4 mt-8 px-4">
            {t("my_account.settings")}
          </h3>
          <div className="space-y-1">
            {settingsMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </div>
        </div>
        
        <div className="p-4 mt-auto border-t bg-gray-50">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <img crossOrigin="anonymous" src={user?.avatar} alt="" className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"/>
            <div className="ml-3">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;