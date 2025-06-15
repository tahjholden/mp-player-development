import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewDashboard from './components/dashboard/NewDashboard';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PlayerList from './components/players/PlayerList';
import PlayerDetail from './components/players/PlayerDetail';
import CoachList from './components/coaches/CoachList';
import CoachDetail from './components/coaches/CoachDetail';
import ObservationList from './components/observations/ObservationList';
import ObservationDetail from './components/observations/ObservationDetail';
import PDPList from './components/pdps/PDPList';
import PDPDetail from './components/pdps/PDPDetail';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewDashboard />} />
        <Route path="/dashboard" element={<NewDashboard />} />
        <Route
          path="/*"
          element={
            <div className="flex h-screen bg-gray-100">
              <Sidebar isSidebarOpen={isSidebarOpen} />
              <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                  <Routes>
                    <Route path="/original-dashboard" element={<Dashboard />} />
                    <Route path="/players" element={<PlayerList />} />
                    <Route path="/players/:id" element={<PlayerDetail />} />
                    <Route path="/coaches" element={<CoachList />} />
                    <Route path="/coaches/:id" element={<CoachDetail />} />
                    <Route path="/observations" element={<ObservationList />} />
                    <Route path="/observations/:id" element={<ObservationDetail />} />
                    <Route path="/pdps" element={<PDPList />} />
                    <Route path="/pdps/:id" element={<PDPDetail />} />
                    <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
                    <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
