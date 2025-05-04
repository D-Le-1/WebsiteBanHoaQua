import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="relative">
      <button
        className="lg:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      <ul className="hidden lg:flex space-x-6 text-gray-600 font-medium">
        <li><Link to="/">{t("menu.home")}</Link></li>
        <li><Link to="/products">{t("menu.product")}</Link></li>
        <li><Link to="/contact">{t("menu.contact")}</Link></li>
        <li><Link to="/about">{t("menu.about")}</Link></li>
        <li>
          {user ? (
            <Link to="/profile">{t("menu.myaccount")}</Link>
          ) : (
            <Link to="/signin">{t("menu.signin")}</Link>
          )}
        </li>
      </ul>
      {menuOpen && (
        <ul className="absolute top-12 left-0 bg-white shadow-md w-48 p-4 rounded-md space-y-4 lg:hidden text-gray-700 font-medium z-50">
          <li><Link to="/">{t("menu.home")}</Link></li>
          <li><Link to="/products">{t("menu.product")}</Link></li>
          <li><Link to="/contact">{t("menu.contact")}</Link></li>
          <li><Link to="/about">{t("menu.about")}</Link></li>
          <li>
            {user ? (
              <Link to="/profile">{t("menu.myaccount")}</Link>
            ) : (
              <Link to="/signin">{t("menu.signin")}</Link>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default Menu;