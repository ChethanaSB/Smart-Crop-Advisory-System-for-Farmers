import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User } from "lucide-react";
import Logo from "./Images/Logo2.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Language options
  const languages = [
    { path: "/languages/kannada", name: "Kannada" },
    { path: "/languages/english", name: "English" },
    { path: "/languages/hindi", name: "Hindi" },
    { path: "/languages/telugu", name: "Telugu" },
    { path: "/languages/tamil", name: "Tamil" },
    { path: "/languages/malayalam", name: "Malayalam" },
  ];

  // Normal menu (added Weather)
  const menuLinks = [
    { path: "/", name: "Home" },
    { path: "/BlogsIndex", name: "Blog" },
    { path: "/CommunityIndex", name: "Community" },
    { path: "/WeatherForecastIndex", name: "Weather" },
    { path: "/MarketPlaceIndex", name: "Market Tracker" }, 
     // ✅ Added Weather
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        scrolled ? "shadow-xl" : ""
      }`}
    >
      <nav
        className={`flex items-center justify-between px-6 md:px-12 py-4 rounded-b-2xl border 
          transition-all duration-500
          ${
            scrolled
              ? "bg-gradient-to-r from-yellow-100/80 to-yellow-200/70 backdrop-blur-xl border-yellow-300/60"
              : "bg-gradient-to-r from-yellow-50/90 to-yellow-100/80 backdrop-blur-md border-yellow-200/50"
          }`}
      >
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="AgroSage Logo" className="w-10 h-10 object-contain" />
          <span className="font-extrabold text-xl text-gray-800 tracking-wide">
            AgroSage
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {menuLinks.map(({ path, name }) => (
            <li key={path}>
              <Link
                to={path}
                className={`relative transition-colors duration-300 
                  after:block after:h-[2px] after:w-0 after:bg-green-600 
                  after:transition-all after:duration-300 hover:after:w-full 
                  after:absolute after:-bottom-1 after:left-0
                  ${
                    location.pathname === path
                      ? "text-green-600 after:w-full font-semibold"
                      : "hover:text-green-600"
                  }`}
              >
                {name}
              </Link>
            </li>
          ))}

          {/* Languages Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 transition-colors duration-300 ${
                dropdownOpen || location.pathname.includes("/languages")
                  ? "text-green-600 font-semibold"
                  : "hover:text-green-600"
              }`}
            >
              Languages <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                {languages.map(({ path, name }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Right Side: Fertilization Form + Recommend + Profile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/FertilizerForm"
            className="px-4 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-blue-300 to-sky-300 hover:from-blue-400 hover:to-sky-400 
              text-gray-900 shadow-md transition-all duration-300"
          >
            Fertilization
          </Link>

          <Link
            to="/RecommendIndex"
            className="px-5 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-green-300 to-lime-300 hover:from-green-400 hover:to-lime-400 
              text-gray-900 shadow-md transition-all duration-300"
          >
            Recommend
          </Link>
          <Link to="/profile" className="p-2 rounded-full hover:bg-green-100 transition">
            <User size={26} className="text-gray-800" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center text-gray-800"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="md:hidden absolute top-[72px] left-0 w-full bg-gradient-to-r 
            from-yellow-50/95 to-yellow-100/90 backdrop-blur-md border-t border-yellow-200/50 
            shadow-lg px-6 py-6 animate-fadeIn"
        >
          <ul className="flex flex-col gap-6 text-gray-700 text-base font-medium">
            {menuLinks.map(({ path, name }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`${
                    location.pathname === path
                      ? "text-green-600 font-semibold"
                      : "hover:text-green-600"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}

            {/* Language options in mobile */}
            <li>
              <span className="font-semibold text-gray-800">Languages</span>
              <ul className="ml-4 mt-2 flex flex-col gap-3">
                {languages.map(({ path, name }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setOpen(false)}
                      className="block hover:text-green-600"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Fertilization + Recommend + Profile in Mobile */}
            <li>
              <Link
                to="/FertilizerForm"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-full 
                  bg-gradient-to-r from-blue-300 to-sky-300 hover:from-blue-400 hover:to-sky-400 
                  text-gray-900 shadow-md transition-all duration-300 inline-block text-center"
              >
                Fertilization
              </Link>
            </li>
            <li>
              <Link
                to="/RecommendIndex"
                onClick={() => setOpen(false)}
                className="px-5 py-2 text-sm font-semibold rounded-full 
                  bg-gradient-to-r from-green-300 to-lime-300 hover:from-green-400 hover:to-lime-400 
                  text-gray-900 shadow-md transition-all duration-300 inline-block text-center"
              >
                Recommend
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 hover:text-green-600"
              >
                <User size={22} /> Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
