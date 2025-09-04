import React, { useState } from 'react';
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { MetricsCard } from '../../components/common';

const BodyMetricsPage: React.FC = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Wait for authentication to be ready
  if (!token || !authUser || authLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            {!token || !authUser ? 'Loading authentication...' : 'Loading body metrics...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            📊 Body Metrics
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 400,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Transform your fitness journey with precision tracking and beautiful insights
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Alert 
              severity="success" 
              onClose={() => setSuccess(null)}
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '1.1rem'
              }}
            >
              {success}
            </Alert>
          </Box>
        )}

        {error && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '1.1rem'
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Main Content - Beautiful Card Layout */}
        
        {/* Body Metrics Card - Circumference Measurements */}
        <MetricsCard
          title="Body Measurements"
          subtitle="Track your circumference measurements and progress over time"
          icon="📏"
          gradientColors={{
            from: '#667eea',
            to: '#764ba2'
          }}
          type="body-metrics"
        />

        {/* Body Composition Card - Body Fat, Muscle, Bone, Water */}
        <MetricsCard
          title="Body Composition"
          subtitle="Monitor your body fat, muscle mass, bone density, and hydration levels"
          icon="🧬"
          gradientColors={{
            from: '#11998e',
            to: '#38ef7d'
          }}
          type="body-composition"
        />

        {/* Weight Tracking Card - Weight History & Analytics */}
        <MetricsCard
          title="Weight Tracking"
          subtitle="Comprehensive weight management with history, trends, and insights"
          icon="⚖️"
          gradientColors={{
            from: '#f093fb',
            to: '#f5576c'
          }}
          type="weight-tracking"
        />
      </Container>
    </Box>
  );
};

export default BodyMetricsPage;
