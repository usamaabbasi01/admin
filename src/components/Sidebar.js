
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaClipboardList, FaUsers, FaSitemap, FaBroadcastTower, FaCogs, FaSignOutAlt, FaAngleDown, FaAngleRight } from 'react-icons/fa';

function Sidebar() {
  const [isEmployeeLinksVisible, setEmployeeLinksVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from localStorage
    window.location.href = '/'; // Redirect to login page
  };

  const handleToggleEmployeeLinks = () => {
    setEmployeeLinksVisible(!isEmployeeLinksVisible);
  };

  const hideEmployeeLinks = () => {
    if (isEmployeeLinksVisible) {
      setEmployeeLinksVisible(false);
    }
  };

  return (
    <div className="shadow-md w-64 min-h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-4">F.O.R.X. Admin</h2>
      <nav>
        <NavLink 
          to="/dashboard"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none"}} 
          className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/monthly-expense"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none"}} 
          className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaClipboardList className="mr-3" />
          Expenses
        </NavLink>
        
        {/* Employee link with toggle for sub-links */}
        <div onClick={handleToggleEmployeeLinks} className="text-gray-600 cursor-pointer flex items-center p-2 my-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
          <FaUser className="mr-3" />
          Employee
          {isEmployeeLinksVisible ? <FaAngleDown className="ml-auto" /> : <FaAngleRight className="ml-auto" />}
        </div>
        
        {/* Sub-links for Employee, conditionally rendered */}
        {isEmployeeLinksVisible && (
          <div className="ml-6">
            <NavLink 
              to="/employee/details"
              style={{textDecoration: "none"}} 
              className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
                ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
              Employee Details
            </NavLink>
            <NavLink 
              to="/employee/add"
              style={{textDecoration: "none"}} 
              className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
                ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
              Add New Employee
            </NavLink>
          </div>
        )}

        <NavLink 
          to="/team"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none"}} 
          className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaUsers className="mr-3" />
          Team
        </NavLink>

        <NavLink 
          to="/designation"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none", padding: "8px 0px 8px 8px", width: "100%"}} 
          className={({ isActive }) => `flex items-center my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaSitemap className="mr-3" />
          Designation
        </NavLink>

        <NavLink 
          to="/stations"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none"}} 
          className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaBroadcastTower className="mr-3" />
          Stations
        </NavLink>

        <NavLink 
          to="/settings"
          onClick={hideEmployeeLinks}
          style={{textDecoration: "none"}} 
          className={({ isActive }) => `flex items-center p-2 my-2 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}>
          <FaCogs className="mr-3" />
          Settings
        </NavLink>

        <NavLink 
          onClick={handleLogout} 
          style={{textDecoration: "none"}} 
          className="flex items-center p-2 mt-4 text-gray-800 hover:bg-red-600 rounded-lg transition-colors duration-200">
          <FaSignOutAlt className="mr-3" />
          Logout
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;



