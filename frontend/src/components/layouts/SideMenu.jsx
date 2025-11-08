import React, {useContext, useState, useEffect} from "react";
import {UserContext} from "../../context/useContext";
import {useNavigate} from "react-router-dom";
import {SIDE_MENU_DATA, SIDE_MENU_USER_DATA} from "../../utils/data";

const SideMenu = ({activeMenu}) => {
  const {user, clearUser} = useContext(UserContext);
  const [sideMenu, setSideMenu] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenu(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 flex flex-col">
      {/* === Profile Section === */}
      <div className="flex flex-col items-center text-center mb-8 pt-6 border-b border-gray-100 pb-6">
        <div className="relative">
          <img
            src={user?.profileImageUrl || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow-sm"
          />
          {user?.role === "admin" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white bg-blue-600 px-3 py-0.5 rounded-full shadow">
              Admin
            </div>
          )}
        </div>

        <h5 className="text-gray-900 font-semibold mt-5 text-[15px]">{user?.name || "User"}</h5>
        <p className="text-gray-500 text-[13px]">{user?.email || "No email"}</p>
      </div>

      {/* === Menu Section === */}
      <div className="flex-1 overflow-y-auto">
        {sideMenu.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-3 px-6 py-3 mb-1 rounded-r-full text-[15px] transition-all duration-200
              ${
                activeMenu === item.label
                  ? "text-blue-600 bg-linear-to-r from-blue-50 to-blue-100 font-semibold border-r-4 border-blue-500"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}>
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
