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
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Slider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  DataUsage as DataUsageIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Backup as BackupIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  Scale as ScaleIcon
} from '@mui/icons-material';

// Static settings data
const staticSettings = {
  appearance: {
    theme: "Light",
    primaryColor: "#1976d2",
    fontSize: "Medium",
    compactMode: false,
    showAnimations: true
  },
  notifications: {
    workoutReminders: true,
    progressUpdates: true,
    achievementAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
    emailNotifications: true,
    reminderTime: "18:00",
    reminderDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  fitness: {
    units: "Imperial",
    defaultWorkoutDuration: 45,
    restBetweenSets: 90,
    autoStartTimer: true,
    showFormTips: true,
    trackHeartRate: true,
    trackCalories: true
  },
  privacy: {
    profileVisibility: "Public",
    workoutHistory: "Friends Only",
    progressSharing: "Private",
    allowFriendRequests: true,
    showOnlineStatus: true,
    dataAnalytics: true
  },
  data: {
    autoBackup: true,
    backupFrequency: "Weekly",
    cloudSync: true,
    dataRetention: "2 years",
    exportFormat: "JSON"
  }
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(staticSettings);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings(staticSettings);
    setOpenResetDialog(false);
  };

  const handleDeleteData = () => {
    // In a real app, this would delete user data
    setOpenDeleteDialog(false);
  };

  const getThemeOptions = () => [
    { value: "Light", label: "Light Theme" },
    { value: "Dark", label: "Dark Theme" },
    { value: "Auto", label: "System Default" }
  ];

  const getUnitOptions = () => [
    { value: "Imperial", label: "Imperial (lbs, inches)" },
    { value: "Metric", label: "Metric (kg, cm)" }
  ];

  const getFontSizeOptions = () => [
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" }
  ];

  const getBackupFrequencyOptions = () => [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" }
  ];

  const getDataRetentionOptions = () => [
    { value: "6 months", label: "6 months" },
    { value: "1 year", label: "1 year" },
    { value: "2 years", label: "2 years" },
    { value: "Forever", label: "Forever" }
  ];

  const getExportFormatOptions = () => [
    { value: "JSON", label: "JSON" },
    { value: "CSV", label: "CSV" },
    { value: "PDF", label: "PDF" }
  ];

  return (
    <Box>
      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your Gym Buddy experience
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save All Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={() => setOpenResetDialog(true)}
        >
          Reset to Default
        </Button>
        <Button
          variant="outlined"
          startIcon={<BackupIcon />}
        >
          Export Settings
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
                  value={settings.appearance.theme}
                  label="Theme"
                  onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                >
                  {getThemeOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={settings.appearance.fontSize}
                  label="Font Size"
                  onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                >
                  {getFontSizeOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appearance.compactMode}
                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                  />
                }
                label="Compact Mode"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appearance.showAnimations}
                    onChange={(e) => handleSettingChange('appearance', 'showAnimations', e.target.checked)}
                  />
                }
                label="Show Animations"
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
                  value={settings.fitness.units}
                  label="Units"
                  onChange={(e) => handleSettingChange('fitness', 'units', e.target.value)}
                >
                  {getUnitOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" gutterBottom>
                Default Workout Duration: {settings.fitness.defaultWorkoutDuration} minutes
              </Typography>
              <Slider
                value={settings.fitness.defaultWorkoutDuration}
                onChange={(_, value) => handleSettingChange('fitness', 'defaultWorkoutDuration', value)}
                min={15}
                max={120}
                step={15}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Rest Between Sets: {settings.fitness.restBetweenSets} seconds
              </Typography>
              <Slider
                value={settings.fitness.restBetweenSets}
                onChange={(_, value) => handleSettingChange('fitness', 'restBetweenSets', value)}
                min={30}
                max={300}
                step={15}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.fitness.autoStartTimer}
                    onChange={(e) => handleSettingChange('fitness', 'autoStartTimer', e.target.checked)}
                  />
                }
                label="Auto-start Timer"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.fitness.showFormTips}
                    onChange={(e) => handleSettingChange('fitness', 'showFormTips', e.target.checked)}
                  />
                }
                label="Show Form Tips"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.fitness.trackHeartRate}
                    onChange={(e) => handleSettingChange('fitness', 'trackHeartRate', e.target.checked)}
                  />
                }
                label="Track Heart Rate"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.fitness.trackCalories}
                    onChange={(e) => handleSettingChange('fitness', 'trackCalories', e.target.checked)}
                  />
                }
                label="Track Calories"
              />
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
                    checked={settings.notifications.workoutReminders}
                    onChange={(e) => handleSettingChange('notifications', 'workoutReminders', e.target.checked)}
                  />
                }
                label="Workout Reminders"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.progressUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'progressUpdates', e.target.checked)}
                  />
                }
                label="Progress Updates"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.achievementAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'achievementAlerts', e.target.checked)}
                  />
                }
                label="Achievement Alerts"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                  />
                }
                label="Weekly Reports"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  />
                }
                label="Push Notifications"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                label="Reminder Time"
                type="time"
                value={settings.notifications.reminderTime}
                onChange={(e) => handleSettingChange('notifications', 'reminderTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Reminder Days
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                  <Chip
                    key={day}
                    label={day.slice(0, 3)}
                    color={settings.notifications.reminderDays.includes(day) ? "primary" : "default"}
                    onClick={() => {
                      const currentDays = settings.notifications.reminderDays;
                      const newDays = currentDays.includes(day)
                        ? currentDays.filter(d => d !== day)
                        : [...currentDays, day];
                      handleSettingChange('notifications', 'reminderDays', newDays);
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
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

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy.profileVisibility}
                  label="Profile Visibility"
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Friends Only">Friends Only</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Workout History</InputLabel>
                <Select
                  value={settings.privacy.workoutHistory}
                  label="Workout History"
                  onChange={(e) => handleSettingChange('privacy', 'workoutHistory', e.target.value)}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Friends Only">Friends Only</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.allowFriendRequests}
                    onChange={(e) => handleSettingChange('privacy', 'allowFriendRequests', e.target.checked)}
                  />
                }
                label="Allow Friend Requests"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.showOnlineStatus}
                    onChange={(e) => handleSettingChange('privacy', 'showOnlineStatus', e.target.checked)}
                  />
                }
                label="Show Online Status"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.dataAnalytics}
                    onChange={(e) => handleSettingChange('privacy', 'dataAnalytics', e.target.value)}
                  />
                }
                label="Data Analytics"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Backup Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DataUsageIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Data & Backup</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.data.autoBackup}
                        onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                      />
                    }
                    label="Auto Backup"
                    sx={{ mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.data.cloudSync}
                        onChange={(e) => handleSettingChange('data', 'cloudSync', e.target.checked)}
                      />
                    }
                    label="Cloud Sync"
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.data.backupFrequency}
                      label="Backup Frequency"
                      onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                    >
                      {getBackupFrequencyOptions().map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Data Retention</InputLabel>
                    <Select
                      value={settings.data.dataRetention}
                      label="Data Retention"
                      onChange={(e) => handleSettingChange('data', 'dataRetention', e.target.value)}
                    >
                      {getDataRetentionOptions().map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                      value={settings.data.exportFormat}
                      label="Export Format"
                      onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
                    >
                      {getExportFormatOptions().map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<BackupIcon />}
                      fullWidth
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      fullWidth
                    >
                      Import Data
                    </Button>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenDeleteDialog(true)}
                      fullWidth
                    >
                      Delete All Data
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reset Settings Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetSettings} color="warning" variant="contained">
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Data Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete All Data</DialogTitle>
        <DialogContent>
          <Typography color="error" gutterBottom>
            ⚠️ Warning: This action is irreversible!
          </Typography>
          <Typography>
            This will permanently delete all your workout data, progress history, and personal information. 
            Are you absolutely sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteData} color="error" variant="contained">
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
