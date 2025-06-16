import React from 'react';
import { 
  RxDashboard, 
  RxPerson, 
  RxGroup 
} from 'react-icons/rx';
import { 
  FaChalkboardTeacher, 
  FaUserFriends, 
  FaClipboardList, 
  FaChartLine 
} from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`bg-[#f8f9fa] text-gray-600 h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out shadow-sm ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-center border-b">
        <h2 className={`text-xl font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>MPB Dashboard</h2>
        <span className={`text-xl font-bold ${isSidebarOpen ? 'hidden' : 'block'}`}>MPB</span>
      </div>
      <div className="py-4">
        <ul>
          {/* Dashboard */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/" className="flex items-center">
              <RxDashboard className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Dashboard</span>
            </Link>
          </li>
          
          {/* Players */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/players" className="flex items-center">
              <RxPerson className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Players</span>
            </Link>
          </li>
          
          {/* Coaches */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/coaches" className="flex items-center">
              <FaChalkboardTeacher className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Coaches</span>
            </Link>
          </li>
          

          
          {/* Observations */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/observations" className="flex items-center">
              <FaClipboardList className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Observations</span>
            </Link>
          </li>
          
          {/* PDPs */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/pdps" className="flex items-center">
              <RxGroup className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>PDPs</span>
            </Link>
          </li>
          
          {/* Analytics */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/analytics" className="flex items-center">
              <FaChartLine className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Analytics</span>
            </Link>
          </li>
          
          {/* Settings */}
          <li className="px-4 py-3 hover:bg-[#e9ecef] cursor-pointer rounded-lg mx-2 mb-1">
            <Link to="/settings" className="flex items-center">
              <IoSettingsOutline className="text-xl" />
              <span className={`ml-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
