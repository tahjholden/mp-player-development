import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { supabase } from './lib/supabase';
import theme from './theme';

// Main components
import NewDashboardUpdated from './components/dashboard/NewDashboardUpdated';
import Layout from './components/Layout';

// Player related components
import PlayerList from './components/players/PlayerList';
import PlayerDetail from './components/players/PlayerDetail';

// Observation related components
import ObservationList from './components/observations/ObservationList';
import ObservationDetail from './components/observations/ObservationDetail';

// PDP related components
import PDPList from './components/pdps/PDPList';
import PDPDetail from './components/pdps/PDPDetail';

// Auth components
import Login from './components/auth/Login';

// Auth context
const AuthContext = React.createContext(null);

export const useAuth = () => React.useContext(AuthContext);

// Auth provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    getUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#000'
          }}
        >
          <CircularProgress sx={{ color: '#CFB53B' }} />
        </Box>
      )}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);
  
  if (loading) return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#000'
      }}
    >
      <CircularProgress sx={{ color: '#CFB53B' }} />
    </Box>
  );
  
  return user ? children : null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<NewDashboardUpdated />} />
              <Route path="dashboard" element={<NewDashboardUpdated />} />
              
              {/* Players */}
              <Route path="players" element={<PlayerList />} />
              <Route path="players/:id" element={<PlayerDetail />} />
              <Route path="players/new" element={<PlayerDetail isNew={true} />} />
              
              {/* Observations */}
              <Route path="observations" element={<ObservationList />} />
              <Route path="observations/:id" element={<ObservationDetail />} />
              <Route path="observations/new" element={<ObservationDetail isNew={true} />} />
              
              {/* PDPs */}
              <Route path="pdps" element={<PDPList />} />
              <Route path="pdps/:id" element={<PDPDetail />} />
              <Route path="pdps/new" element={<PDPDetail isNew={true} />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
