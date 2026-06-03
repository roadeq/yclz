import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow w-full">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center h-16">
        <div className="max-w-[1126px] w-full flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="text-2xl font-semibold text-indigo-600">StockHub</div>
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "px-3 py-2 text-sm font-medium text-indigo-600" : "px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? "px-3 py-2 text-sm font-medium text-indigo-600" : "px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"}>
              Products
            </NavLink>
            <NavLink to="/warehouses" className={({ isActive }) => isActive ? "px-3 py-2 text-sm font-medium text-indigo-600" : "px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"}>
              Warehouses
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? "px-3 py-2 text-sm font-medium text-indigo-600" : "px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"}>
              Transactions
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? "px-3 py-2 text-sm font-medium text-indigo-600" : "px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"}>
              Reports
            </NavLink>
          </nav>
        </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
