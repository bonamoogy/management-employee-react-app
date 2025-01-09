import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaSignOutAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SidebarContent = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Karyawan", path: "/employees", icon: <FaUser /> },
    { name: "Unit", path: "/units", icon: <FaBuilding /> },
    { name: "Jabatan", path: "/positions", icon: <FaBriefcase /> },
  ];

  if (location.pathname.startsWith("/auth")) {
    return null;
  }

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="h-screen w-64 bg-base-200 shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-4 text-lg font-bold">Management-Employee</div>
        <ul className="menu p-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${
                location.pathname === item.path ? "bg-primary" : ""
              } group`}
            >
              <Link to={item.path} className="flex items-center gap-2">
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-white font-bold"
                      : "text-gray-800"
                  } group-hover:text-white group-hover:font-bold`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <button
          className="btn btn-error w-full flex items-center justify-center gap-2"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {isLogoutDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-300 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Logout</h2>
            <p className="mb-6">Apakah Anda yakin ingin keluar?</p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Batal
              </button>
              <button className="btn btn-error" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarContent;
