import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, Card, CardContent, Grid } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Learn By Doing
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        Interactive problem-solving for better learning
      </Typography>
      
      <Box sx={{ mt: 4, mb: 6 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/problems"
          sx={{ mr: 2 }}
        >
          Explore Problems
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/register"
        >
          Get Started
        </Button>
      </Box>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Interactive Learning
              </Typography>
              <Typography variant="body1">
                Solve problems step-by-step with interactive tools and visualizations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Guided Approach
              </Typography>
              <Typography variant="body1">
                Get hints and guidance when you need it, without giving away the solution.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Track Progress
              </Typography>
              <Typography variant="body1">
                Monitor your learning journey and see your improvement over time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
