import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../store/slices/authSlice';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleUserNavigate = (path) => {
    navigate(path);
    handleUserMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleUserMenuClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Learn By Doing
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/problems">
              Problems
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleUserMenu}
                    color="inherit"
                    size="large"
                    sx={{ ml: 1 }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={() => handleUserNavigate('/profile')}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigate('/problems')}>Problems</MenuItem>
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
                  <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => {
                    dispatch(logout());
                    handleNavigate('/login');
                  }}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => handleNavigate('/login')}>Login</MenuItem>
                  <MenuItem onClick={() => handleNavigate('/register')}>Register</MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
