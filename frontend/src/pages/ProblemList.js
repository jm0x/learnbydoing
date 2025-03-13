import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchProblems } from '../store/slices/problemSlice';

const difficultyColor = (level) => {
  if (level <= 3) return 'success';
  if (level <= 7) return 'warning';
  return 'error';
};

const ProblemList = () => {
  const { problems, isLoading, error } = useSelector(state => state.problems);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);
  
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
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Problems
      </Typography>
      
      {problems.length === 0 ? (
        <Typography variant="body1">
          No problems available yet.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {problems.map((problem) => (
            <Grid item xs={12} md={6} lg={4} key={problem.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {problem.title}
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Chip 
                      label={problem.subject} 
                      color="primary" 
                      size="small" 
                    />
                    <Chip 
                      label={`Difficulty: ${problem.difficulty}`} 
                      color={difficultyColor(problem.difficulty)} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {problem.description.length > 150 
                      ? `${problem.description.substring(0, 150)}...` 
                      : problem.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/problems/${problem.id}`}
                  >
                    Solve Problem
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProblemList;
