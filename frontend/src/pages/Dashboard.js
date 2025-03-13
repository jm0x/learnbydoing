import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { fetchUserProgress } from '../store/slices/progressSlice';
import { fetchProblems } from '../store/slices/problemSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userProgress, isLoading: progressLoading } = useSelector(state => state.progress);
  const { problems, isLoading: problemsLoading } = useSelector(state => state.problems);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(fetchUserProgress());
    dispatch(fetchProblems());
  }, [dispatch]);
  
  const isLoading = progressLoading || problemsLoading;
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Calculate statistics
  const totalProblems = problems.length;
  const completedProblems = userProgress.filter(p => p.completed).length;
  const completionRate = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;
  
  // Get in-progress problems
  const inProgressProblems = userProgress
    .filter(p => !p.completed && p.current_step > 0)
    .map(progress => {
      const problem = problems.find(p => p.id === progress.problem_id);
      return {
        ...progress,
        problem,
        progressPercentage: problem ? (progress.current_step / problem.steps.length) * 100 : 0
      };
    });
  
  // Get completed problems
  const completedProblemsList = userProgress
    .filter(p => p.completed)
    .map(progress => {
      const problem = problems.find(p => p.id === progress.problem_id);
      return {
        ...progress,
        problem
      };
    });
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        {/* Progress Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completion Rate</Typography>
                <Typography variant="body2">{completionRate.toFixed(1)}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completionRate} 
                sx={{ mb: 2, height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2">
                {completedProblems} of {totalProblems} problems completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Continue Learning */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Continue Learning
              </Typography>
              
              {inProgressProblems.length === 0 ? (
                <Typography variant="body2">
                  You don't have any problems in progress.{' '}
                  <Link to="/problems">Start solving now</Link>
                </Typography>
              ) : (
                <List>
                  {inProgressProblems.map((item) => (
                    <ListItem key={item.problem_id} component={Link} to={`/problems/${item.problem_id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListItemText
                        primary={item.problem?.title || 'Unknown Problem'}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" component="span">
                                Step {item.current_step} of {item.problem?.steps.length}
                              </Typography>
                              <Typography variant="body2" component="span">
                                {item.progressPercentage.toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={item.progressPercentage} 
                              sx={{ height: 5, borderRadius: 5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Completed Problems */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed Problems
              </Typography>
              
              {completedProblemsList.length === 0 ? (
                <Typography variant="body2">
                  You haven't completed any problems yet.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {completedProblemsList.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.problem_id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {item.problem?.title || 'Unknown Problem'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={item.problem?.subject} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={`Hints: ${item.hints_used}`} 
                              size="small" 
                              color={item.hints_used > 0 ? "default" : "success"}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Completed all {item.problem?.steps.length} steps
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
