import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import {
  Palette as PaletteIcon,
  FitnessCenter as FitnessCenterIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'Light',
    units: 'Imperial',
    notifications: true,
    compactMode: false
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings({
      theme: 'Light',
      units: 'Imperial',
      notifications: true,
      compactMode: false
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Settings ⚙️
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize your Gym Buddy experience
      </Typography>

      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleResetSettings}
        >
          Reset to Default
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <MenuItem value="Light">Light Theme</MenuItem>
                  <MenuItem value="Dark">Dark Theme</MenuItem>
                  <MenuItem value="Auto">System Default</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  />
                }
                label="Compact Mode"
                sx={{ mb: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Fitness Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenterIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Fitness Preferences</Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Units</InputLabel>
                <Select
                  value={settings.units}
                  label="Units"
                  onChange={(e) => handleSettingChange('units', e.target.value)}
                >
                  <MenuItem value="Imperial">Imperial (lbs, inches)</MenuItem>
                  <MenuItem value="Metric">Metric (kg, cm)</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose your preferred measurement system for workouts and progress tracking.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                }
                label="Enable Notifications"
                sx={{ mb: 1 }}
              />

              <Typography variant="body2" color="text.secondary">
                Receive workout reminders and progress updates.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Privacy & Security</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your privacy settings and data preferences.
              </Typography>

              <Button variant="outlined" size="small">
                Privacy Policy
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            About Gym Buddy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Gym Buddy is your personal fitness companion, helping you track workouts, 
            monitor progress, and achieve your fitness goals.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Version 1.0.0 • Built with React & Material-UI
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
