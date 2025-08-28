import React from 'react';
import { Box, Typography, Card, Grid, Button, Tooltip, IconButton } from '@mui/material';
import { Add as AddIcon, Scale, Flag as Target, Help } from '@mui/icons-material';
import { BodyMetrics, BodyMeasurements, bodyMetricsUtils } from '../../../services';

interface MetricsDashboardProps {
  currentMetrics: BodyMetrics | null;
  currentMeasurements: BodyMeasurements | null;
  onOpenMetricsDialog: () => void;
  onOpenWeightDialog: () => void;
  onOpenGoalDialog: () => void;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  currentMetrics,
  currentMeasurements,
  onOpenMetricsDialog,
  onOpenWeightDialog,
  onOpenGoalDialog
}) => {
  return (
    <>
      {/* Hero Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <Typography variant="h1" sx={{ 
          mb: 2,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          fontSize: { xs: '2.5rem', md: '4rem' },
          position: 'relative',
          zIndex: 1
        }}>
          BODY METRICS
        </Typography>
        
        <Typography variant="h5" sx={{ 
          color: 'text.secondary',
          fontWeight: 400,
          maxWidth: 600,
          mx: 'auto',
          mb: 4,
          position: 'relative',
          zIndex: 1
        }}>
          Transform your fitness journey with precision tracking and beautiful insights
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <Tooltip title="Record comprehensive body metrics including measurements and composition" arrow>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onOpenMetricsDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 25px rgba(233, 69, 96, 0.3)'
                }
              }}
            >
              Record Metrics
            </Button>
          </Tooltip>
          
          <Tooltip title="Log your daily weight and track your progress over time" arrow>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Scale />}
              onClick={onOpenWeightDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: '#1a1a2e',
                color: '#1a1a2e',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#e94560',
                  color: '#e94560',
                  backgroundColor: 'rgba(233, 69, 96, 0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Log Weight
            </Button>
          </Tooltip>
          
          <Tooltip title="Set fitness goals and track your progress towards achieving them" arrow>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Target />}
              onClick={onOpenGoalDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: '#00d4aa',
                color: '#00d4aa',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#00b894',
                  color: '#00b894',
                  backgroundColor: 'rgba(0, 212, 170, 0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Set Goal
            </Button>
          </Tooltip>

          {/* Help Button */}
          <Tooltip title="Get contextual help for this page" arrow>
            <IconButton
              onClick={() => {/* TODO: Implement help */}}
              sx={{
                p: 1.5,
                border: '2px solid #3742fa',
                color: '#3742fa',
                '&:hover': {
                  backgroundColor: 'rgba(55, 66, 250, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Help />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Current Metrics Dashboard */}
      {currentMetrics && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ 
            mb: 4, 
            textAlign: 'center',
            fontWeight: 700,
            color: 'text.primary'
          }}>
            Current Status
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                textAlign: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }} />
                
                {/* Edit Button - Top Right */}
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2
                }}>
                  <Button 
                    size="small" 
                    onClick={onOpenWeightDialog}
                    sx={{
                      minWidth: 'auto',
                      px: 1,
                      py: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
                
                <Typography variant="h2" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  {currentMetrics.weight || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  mb: 2
                }}>
                  {currentMetrics.weight ? (currentMetrics.weightUnit || 'kg') : ''}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Current Weight
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                color: 'white',
                textAlign: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }} />
                <Typography variant="h2" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  {currentMetrics.height || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  mb: 2
                }}>
                  {currentMetrics.height ? (currentMetrics.heightUnit || 'cm') : ''}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Height
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                color: 'white',
                textAlign: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }} />
                <Typography variant="h2" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  {currentMetrics.bmi || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  mb: 2
                }}>
                  BMI
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Body Mass Index
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
                color: 'white',
                textAlign: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }} />
                <Typography variant="h2" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  {currentMetrics.bodyFatPercentage || 'N/A'}
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  mb: 2
                }}>
                  {currentMetrics.bodyFatPercentage ? '%' : ''}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Body Fat
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Basic Information Card */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 700,
          color: 'text.primary'
        }}>
          Basic Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              color: 'text.primary',
              textAlign: 'center',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {/* Edit Button - Top Right */}
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2
              }}>
                <Button 
                  size="small" 
                  onClick={onOpenMetricsDialog}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'text.primary',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderColor: 'rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  Edit
                </Button>
              </Box>
              
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1,
                color: 'text.primary'
              }}>
                {currentMetrics?.height || 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                mb: 2
              }}>
                {currentMetrics?.height ? (currentMetrics.heightUnit || 'cm') : ''}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Height
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              color: 'text.primary',
              textAlign: 'center',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {/* Edit Button - Top Right */}
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2
              }}>
                <Button 
                  size="small" 
                  onClick={onOpenMetricsDialog}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'text.primary',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderColor: 'rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  Edit
                </Button>
              </Box>
              
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1,
                color: 'text.primary'
              }}>
                {currentMetrics?.weight || 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                mb: 2
              }}>
                {currentMetrics?.weight ? (currentMetrics.weightUnit || 'kg') : ''}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Weight
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              color: 'text.primary',
              textAlign: 'center',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {/* Edit Button - Top Right */}
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2
              }}>
                <Button 
                  size="small" 
                  onClick={onOpenMetricsDialog}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'text.primary',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderColor: 'rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  Edit
                </Button>
              </Box>
              
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1,
                color: 'text.primary'
              }}>
                {currentMetrics?.bmi || 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                mb: 2
              }}>
                BMI
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Body Mass Index
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Body Measurements Section - New API Integration */}
      {currentMeasurements && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ 
            mb: 4, 
            textAlign: 'center',
            fontWeight: 700,
            color: 'text.primary'
          }}>
            Current Body Measurements
          </Typography>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            mb: 4, 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}>
            Last updated: {bodyMetricsUtils.formatMeasurementDate(currentMeasurements.measurementDate)}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Chest */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.chest)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Chest
                </Typography>
              </Card>
            </Grid>

            {/* Waist */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.waist)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Waist
                </Typography>
              </Card>
            </Grid>

            {/* Hips */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.hips)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Hips
                </Typography>
              </Card>
            </Grid>

            {/* Biceps */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.biceps)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Biceps
                </Typography>
              </Card>
            </Grid>

            {/* Thighs */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.thighs)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Thighs
                </Typography>
              </Card>
            </Grid>

            {/* Calves */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)',
                color: 'white',
                textAlign: 'center',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  mb: 1
                }}>
                  {bodyMetricsUtils.formatMeasurement(currentMeasurements.calves)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Calves
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Notes Section */}
          {currentMeasurements.notes && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Card sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid',
                borderColor: 'grey.200',
                p: 3
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  Notes
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  "{currentMeasurements.notes}"
                </Typography>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {/* No Measurements Message */}
      {!currentMeasurements && (
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid',
            borderColor: 'grey.200',
            p: 4
          }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
              No Body Measurements Yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Start tracking your body measurements to monitor your fitness progress
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onOpenMetricsDialog}
              sx={{
                background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)'
                }
              }}
            >
              Record First Measurement
            </Button>
          </Card>
        </Box>
      )}
    </>
  );
};

export default MetricsDashboard;
