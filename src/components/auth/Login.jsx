import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon
} from '@mui/icons-material';

const Login = () => {
  const { user, signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }
      
      // Successful login will trigger the useEffect above to redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#000'
        }}
      >
        <CircularProgress sx={{ color: oldGold }} />
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        py: 3
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#121212',
            borderRadius: 2,
            border: `1px solid ${oldGold}`,
            boxShadow: `0 4px 20px rgba(207, 181, 59, 0.15)`
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: oldGold,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}
          >
            <LockIcon sx={{ color: '#000', fontSize: 28 }} />
          </Box>
          
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              mb: 3
            }}
          >
            Player Development
          </Typography>
          
          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#f44336',
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: oldGold
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: oldGold
                  },
                  '& input': {
                    color: '#fff'
                  }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: oldGold
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: oldGold
                  },
                  '& input': {
                    color: '#fff'
                  }
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: oldGold,
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#BFA52B'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(207, 181, 59, 0.3)',
                  color: 'rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#000' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} Player Development App
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
