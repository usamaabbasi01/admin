// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';
import Employee from './pages/Employee';
import EmployeeDetails from './pages/EmployeeDetails';
import AddEmployee from './pages/AddNewEmployee';
import Team from './pages/Team';
import Designation from './pages/Designation';
import Stations from './pages/Stations';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const isLoginPage = location.pathname === '/'; // Check if on login page

  return (
    <div className="flex">
      {!isLoginPage && user && <Sidebar />} {/* Render Sidebar only if user is logged in and not on the login page */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/record" element={user ? <Record /> : <Navigate to="/" />} />
          <Route path="/employee" element={user ? <Employee /> : <Navigate to="/" />} />
          <Route path="/team" element={user ? <Team /> : <Navigate to="/" />} />
          <Route path="/designation" element={user ? <Designation /> : <Navigate to="/" />} />
          <Route path="/stations" element={user ? <Stations /> : <Navigate to="/" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />

          <Route path="/employee/details" element={<EmployeeDetails />} />
          <Route path="/employee/add" element={<AddEmployee />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
