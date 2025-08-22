import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessCenterIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Height as HeightIcon,
  Scale as ScaleIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

// Static user profile data
const staticUserProfile = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    height: 72, // inches
    weight: 175, // lbs
    location: "New York, NY",
    timezone: "America/New_York"
  },
  fitnessProfile: {
    fitnessLevel: "Intermediate",
    primaryGoal: "Build Muscle",
    secondaryGoal: "Lose Fat",
    experience: "2-3 years",
    preferredWorkoutTime: "Morning",
    workoutDuration: "45-60 minutes",
    workoutFrequency: "4-5 times per week",
    injuries: ["None"],
    limitations: ["None"],
    favoriteExercises: ["Squats", "Deadlifts", "Bench Press", "Pull-ups"]
  },
  preferences: {
    theme: "Light",
    language: "English",
    units: "Imperial",
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      achievementAlerts: true,
      weeklyReports: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: "Public",
      workoutHistory: "Friends Only",
      progressSharing: "Private"
    }
  },
  achievements: {
    totalWorkouts: 156,
    currentStreak: 12,
    longestStreak: 45,
    totalWeightLifted: "2,450,000 lbs",
    totalDistance: "1,250 miles",
    totalCalories: "125,000 cal",
    badges: [
      { name: "First Workout", date: "2023-01-15", icon: "🎯" },
      { name: "10 Workouts", date: "2023-02-20", icon: "💪" },
      { name: "50 Workouts", date: "2023-06-15", icon: "🏆" },
      { name: "100 Workouts", date: "2023-12-01", icon: "👑" },
      { name: "30 Day Streak", date: "2024-01-15", icon: "🔥" }
    ]
  }
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(staticUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile.personalInfo);
  const [openPreferences, setOpenPreferences] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditForm(profile.personalInfo);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      personalInfo: editForm
    });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditForm({
      ...editForm,
      [field]: value
    });
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [setting]: value
        }
      }
    });
  };

  const handlePrivacyChange = (setting: string, value: string) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        privacy: {
          ...profile.preferences.privacy,
          [setting]: value
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box>
      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and preferences
          </Typography>
        </Box>
        <Button
          variant={isEditing ? "outlined" : "contained"}
          startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
          onClick={handleEditToggle}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Personal Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={isEditing ? editForm.firstName : profile.personalInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={isEditing ? editForm.lastName : profile.personalInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={isEditing ? editForm.email : profile.personalInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={isEditing ? editForm.phone : profile.personalInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    value={isEditing ? editForm.dateOfBirth : profile.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={isEditing ? editForm.gender : profile.personalInfo.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (inches)"
                    value={isEditing ? editForm.height : profile.personalInfo.height}
                    onChange={(e) => handleInputChange('height', Number(e.target.value))}
                    disabled={!isEditing}
                    margin="normal"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (lbs)"
                    value={isEditing ? editForm.weight : profile.personalInfo.weight}
                    onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                    disabled={!isEditing}
                    margin="normal"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={isEditing ? editForm.location : profile.personalInfo.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    value={calculateAge(profile.personalInfo.dateOfBirth)}
                    disabled
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Fitness Profile */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenterIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Fitness Profile</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Fitness Level</Typography>
                  <Typography variant="body1" gutterBottom>{profile.fitnessProfile.fitnessLevel}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Primary Goal</Typography>
                  <Typography variant="body1" gutterBottom>{profile.fitnessProfile.primaryGoal}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                  <Typography variant="body1" gutterBottom>{profile.fitnessProfile.experience}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Workout Frequency</Typography>
                  <Typography variant="body1" gutterBottom>{profile.fitnessProfile.workoutFrequency}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Favorite Exercises</Typography>
                  <Box sx={{ mt: 1 }}>
                    {profile.fitnessProfile.favoriteExercises.map((exercise, index) => (
                      <Chip
                        key={index}
                        label={exercise}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Profile Avatar & Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem',
                  bgcolor: 'primary.main'
                }}
              >
                {profile.personalInfo.firstName[0]}{profile.personalInfo.lastName[0]}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile.fitnessProfile.fitnessLevel} • {profile.fitnessProfile.primaryGoal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {formatDate('2023-01-01')}
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Stats</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FitnessCenterIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${profile.achievements.totalWorkouts} workouts`}
                    secondary="Total completed"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HeartIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${profile.achievements.currentStreak} days`}
                    secondary="Current streak"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScaleIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${profile.personalInfo.weight} lbs`}
                    secondary="Current weight"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HeightIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${profile.personalInfo.height}"`}
                    secondary="Height"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Preferences Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PaletteIcon />}
            onClick={() => setOpenPreferences(true)}
          >
            Preferences
          </Button>
        </Grid>
      </Grid>

      {/* Preferences Dialog */}
      <Dialog open={openPreferences} onClose={() => setOpenPreferences(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preferences & Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Notifications */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Notifications</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.workoutReminders}
                      onChange={(e) => handleNotificationChange('workoutReminders', e.target.checked)}
                    />
                  }
                  label="Workout Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.progressUpdates}
                      onChange={(e) => handleNotificationChange('progressUpdates', e.target.checked)}
                    />
                  }
                  label="Progress Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.achievementAlerts}
                      onChange={(e) => handleNotificationChange('achievementAlerts', e.target.checked)}
                    />
                  }
                  label="Achievement Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.preferences.notifications.weeklyReports}
                      onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                    />
                  }
                  label="Weekly Reports"
                />
              </Grid>

              {/* Privacy */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Privacy</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Profile Visibility</InputLabel>
                  <Select
                    value={profile.preferences.privacy.profileVisibility}
                    label="Profile Visibility"
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Friends Only">Friends Only</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Workout History</InputLabel>
                  <Select
                    value={profile.preferences.privacy.workoutHistory}
                    label="Workout History"
                    onChange={(e) => handlePrivacyChange('workoutHistory', e.target.value)}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Friends Only">Friends Only</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Progress Sharing</InputLabel>
                  <Select
                    value={profile.preferences.privacy.progressSharing}
                    label="Progress Sharing"
                    onChange={(e) => handlePrivacyChange('progressSharing', e.target.value)}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Friends Only">Friends Only</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreferences(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
