import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { fetchProblemById } from '../store/slices/problemSlice';
import { updateProgress } from '../store/slices/progressSlice';

const ProblemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, isLoading, error } = useSelector(state => state.problems);
  const { currentProgress } = useSelector(state => state.progress);
  const [activeStep, setActiveStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProblemById(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    // Set active step from user progress if available
    if (currentProgress && currentProgress.problem_id === parseInt(id)) {
      setActiveStep(currentProgress.current_step);
    }
  }, [currentProgress, id]);
  
  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    
    // Update progress in the database
    dispatch(updateProgress({
      problemId: id,
      data: {
        current_step: nextStep,
        completed: nextStep >= (currentProblem?.steps?.length || 0)
      }
    }));
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleShowHint = () => {
    setShowHint(true);
    
    // Update hints used count
    if (currentProgress) {
      dispatch(updateProgress({
        problemId: id,
        data: {
          hints_used: (currentProgress.hints_used || 0) + 1
        }
      }));
    }
  };
  
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
  
  if (!currentProblem) {
    return (
      <Typography variant="body1">
        Problem not found.
      </Typography>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {currentProblem.title}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          {currentProblem.description}
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Guided Solution
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {currentProblem.steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{`Step ${index + 1}`}</StepLabel>
              <StepContent>
                <Typography>{step.content}</Typography>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === currentProblem.steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === currentProblem.steps.length && (
          <Paper square elevation={0} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Congratulations! You've completed this problem.
            </Typography>
            <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Need Help?
        </Typography>
        
        {!showHint && (
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleShowHint}
            sx={{ mr: 2 }}
          >
            Show Hint
          </Button>
        )}
        
        {!showSolution && (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => setShowSolution(true)}
          >
            Show Solution
          </Button>
        )}
        
        {showHint && currentProblem.hints.length > 0 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Hint
              </Typography>
              <Typography variant="body1">
                {currentProblem.hints[0].content}
              </Typography>
            </CardContent>
          </Card>
        )}
        
        {showSolution && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                Solution
              </Typography>
              <Typography variant="body1">
                {currentProblem.solution}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ProblemDetail;
