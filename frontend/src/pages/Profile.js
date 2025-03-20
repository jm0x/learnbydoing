import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Person as PersonIcon, 
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { fetchCurrentUser } from '../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated } = useSelector(state => state.auth);
  const { userProgress } = useSelector(state => state.progress);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch user data if not already loaded
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, navigate, user]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Loading user information...
      </Alert>
    );
  }
  
  // Calculate user statistics
  const completedProblems = userProgress?.filter(p => p.completed)?.length || 0;
  const inProgressProblems = userProgress?.filter(p => !p.completed && p.current_step > 0)?.length || 0;
  const totalAttempted = userProgress?.length || 0;
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      
      <Grid container spacing={4}>
        {/* User Information Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" component="h2">
                {user.username}
              </Typography>
              {user.is_active && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 0.5 }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Active Account
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Username" 
                  secondary={user.username} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="User ID" 
                  secondary={user.id} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* User Statistics */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Statistics
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <Typography variant="h4" color="primary">
                      {completedProblems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Problems
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <Typography variant="h4" color="secondary">
                      {inProgressProblems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <Typography variant="h4" color="info.main">
                      {totalAttempted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Attempted
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Welcome to your Learn By Doing profile! This is where you can view your account information and track your learning progress.
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Your account is {user.is_active ? 'active' : 'inactive'}. You can continue learning and tracking your progress through the dashboard.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
