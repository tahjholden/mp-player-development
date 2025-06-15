import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlayerList from './components/players/PlayerList';
import PDPList from './components/pdps/PDPList';
import PDPDetail from './components/pdps/PDPDetail';
import ObservationList from './components/observations/ObservationList';
import ObservationDetail from './components/observations/ObservationDetail';
import CoachList from './components/coaches/CoachList';
import CoachDetail from './components/coaches/CoachDetail';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/pdps" element={<PDPList />} />
            <Route path="/pdps/:id" element={<PDPDetail />} />
            <Route path="/observations" element={<ObservationList />} />
            <Route path="/observations/:id" element={<ObservationDetail />} />
            <Route path="/coaches" element={<CoachList />} />
            <Route path="/coaches/:id" element={<CoachDetail />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 