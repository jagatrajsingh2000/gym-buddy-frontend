import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip, CircularProgress, Alert,
  TextField, InputAdornment, Button, Grid, Avatar, Rating, Divider, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  FitnessCenter, TrendingUp, CalendarToday, CheckCircle, Schedule, Search, LocationOn, Star, Person,
  Phone, Email, AccessTime, Directions
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { workoutService, Workout } from '../../services/workoutService';
import { getDemoWorkouts } from '../../data/demoWorkouts';

// Mock data for trainers and gyms
const mockTrainers = [
  {
    id: 1,
    name: 'John Smith',
    specialization: 'Strength Training',
    experience: '8 years',
    rating: 4.8,
    hourlyRate: 50,
    location: 'Downtown Gym',
    phone: '+1-555-0123',
    email: 'john.smith@email.com',
    available: true,
    image: 'https://via.placeholder.com/60'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    specialization: 'Cardio & HIIT',
    experience: '5 years',
    rating: 4.9,
    hourlyRate: 45,
    location: 'Fitness Plus',
    phone: '+1-555-0124',
    email: 'sarah.johnson@email.com',
    available: true,
    image: 'https://via.placeholder.com/60'
  },
  {
    id: 3,
    name: 'Mike Chen',
    specialization: 'Yoga & Flexibility',
    experience: '10 years',
    rating: 4.7,
    hourlyRate: 40,
    location: 'Wellness Center',
    phone: '+1-555-0125',
    email: 'mike.chen@email.com',
    available: false,
    image: 'https://via.placeholder.com/60'
  }
];

const mockGyms = [
  {
    id: 1,
    name: 'Downtown Gym',
    type: 'Full Service',
    rating: 4.6,
    location: '123 Main St, Downtown',
    hours: '24/7',
    phone: '+1-555-0001',
    email: 'info@downtowngym.com',
    amenities: ['Cardio Equipment', 'Weight Room', 'Pool', 'Spa'],
    monthlyFee: 89,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 2,
    name: 'Fitness Plus',
    type: 'Premium',
    rating: 4.8,
    location: '456 Oak Ave, Midtown',
    hours: '5AM-11PM',
    phone: '+1-555-0002',
    email: 'info@fitnessplus.com',
    amenities: ['Personal Training', 'Group Classes', 'Sauna', 'Childcare'],
    monthlyFee: 129,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 3,
    name: 'Wellness Center',
    type: 'Specialized',
    rating: 4.5,
    location: '789 Pine St, Uptown',
    hours: '6AM-10PM',
    phone: '+1-555-0003',
    email: 'info@wellnesscenter.com',
    amenities: ['Yoga Studio', 'Meditation Room', 'Nutritionist', 'Massage'],
    monthlyFee: 99,
    image: 'https://via.placeholder.com/80'
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ClientDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'trainers' | 'gyms'>('trainers');
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [gymDialogOpen, setGymDialogOpen] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        let workoutData: Workout[] = [];
        
        if (user?.userType === 'client') {
          // Use demo data for demo users
          workoutData = getDemoWorkouts('client');
        } else {
          // Fetch from API for real users
          workoutData = await workoutService.getUserWorkouts(token!);
        }
        
        setWorkouts(workoutData);
      } catch (err) {
        setError('Failed to fetch workouts');
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchWorkouts();
    }
  }, [token, user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTrainerSelect = (trainer: any) => {
    setSelectedTrainer(trainer);
    setTrainerDialogOpen(true);
  };

  const handleGymSelect = (gym: any) => {
    setSelectedGym(gym);
    setGymDialogOpen(true);
  };

  const filteredTrainers = mockTrainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGyms = mockGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const upcomingWorkouts = workouts.filter(w => w.status === 'planned');
  const inProgressWorkouts = workouts.filter(w => w.status === 'in_progress');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1, md: 2 }, maxWidth: '100%' }}>
      <Typography variant="h4" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 600, color: 'text.primary' }}>
        Welcome back, {user?.firstName}! 💪
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 } }}>
        Manage your fitness journey, find trainers, and discover gyms
      </Typography>

      {/* Stats Cards */}
      <GridComponent container spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <FitnessCenter sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {completedWorkouts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Workouts Completed
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {workouts.length > 0 ? Math.ceil(workouts.length / 7) : 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Weekly Average
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <CalendarToday sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {upcomingWorkouts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming Workouts
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <CheckCircle sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {inProgressWorkouts.length > 0 ? 'Active' : 'Ready'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Status
            </Typography>
          </Paper>
        </GridComponent>
      </GridComponent>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="client dashboard tabs">
            <Tab label="Overview" />
            <Tab label="Find Trainers" />
            <Tab label="Find Gyms" />
            <Tab label="My Plans" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <GridComponent container spacing={1}>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 1 }} />
                    Recent Workouts
                  </Typography>
                  {workouts.slice(0, 3).length > 0 ? (
                    <List dense>
                      {workouts.slice(0, 3).map((workout) => (
                        <ListItem key={workout.id} divider>
                          <ListItemIcon>
                            <FitnessCenter color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={workout.name}
                            secondary={`${workout.duration} min • ${workout.status}`}
                          />
                          <Chip
                            label={workout.status}
                            color={workout.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No workouts yet. Start your fitness journey!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </GridComponent>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<FitnessCenter />}
                      fullWidth
                      onClick={() => setTabValue(3)}
                    >
                      View My Plans
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Person />}
                      fullWidth
                      onClick={() => setTabValue(1)}
                    >
                      Find a Trainer
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LocationOn />}
                      fullWidth
                      onClick={() => setTabValue(2)}
                    >
                      Find a Gym
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>
          </GridComponent>
        </TabPanel>

        {/* Find Trainers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Find Your Perfect Trainer
            </Typography>
            <GridComponent container spacing={2} alignItems="center">
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search trainers by name, specialization, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Search Type</InputLabel>
                  <Select
                    value={searchType}
                    label="Search Type"
                    onChange={(e) => setSearchType(e.target.value as 'trainers' | 'gyms')}
                  >
                    <MenuItem value="trainers">Trainers</MenuItem>
                    <MenuItem value="gyms">Gyms</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
            </GridComponent>
          </Box>

          <GridComponent container spacing={2}>
            {filteredTrainers.map((trainer) => (
              <GridComponent item xs={12} md={6} key={trainer.id}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }} onClick={() => handleTrainerSelect(trainer)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={trainer.image} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {trainer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trainer.specialization}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Rating value={trainer.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {trainer.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.experience} experience
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${trainer.hourlyRate}/hr
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {trainer.location}
                      </Typography>
                    </Box>
                    <Chip
                      label={trainer.available ? 'Available' : 'Not Available'}
                      color={trainer.available ? 'success' : 'default'}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </GridComponent>
            ))}
          </GridComponent>
        </TabPanel>

        {/* Find Gyms Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Discover Great Gyms
            </Typography>
            <GridComponent container spacing={2} alignItems="center">
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search gyms by name, type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Search Type</InputLabel>
                  <Select
                    value={searchType}
                    label="Search Type"
                    onChange={(e) => setSearchType(e.target.value as 'trainers' | 'gyms')}
                  >
                    <MenuItem value="trainers">Trainers</MenuItem>
                    <MenuItem value="gyms">Gyms</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
            </GridComponent>
          </Box>

          <GridComponent container spacing={2}>
            {filteredGyms.map((gym) => (
              <GridComponent item xs={12} md={6} key={gym.id}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }} onClick={() => handleGymSelect(gym)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={gym.image} sx={{ width: 80, height: 80, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {gym.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {gym.type}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Rating value={gym.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {gym.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {gym.hours}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${gym.monthlyFee}/month
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {gym.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {gym.amenities.slice(0, 3).map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" variant="outlined" />
                      ))}
                      {gym.amenities.length > 3 && (
                        <Chip label={`+${gym.amenities.length - 3} more`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </GridComponent>
            ))}
          </GridComponent>
        </TabPanel>

        {/* My Plans Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Manage Your Fitness Plans
          </Typography>
          <GridComponent container spacing={2}>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <FitnessCenter sx={{ mr: 1 }} />
                    Workout Plans
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create and manage your personalized workout routines
                  </Typography>
                  <Button variant="contained" fullWidth>
                    Manage Workouts
                  </Button>
                </CardContent>
              </Card>
            </GridComponent>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    Diet Plans
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Customize your nutrition and meal planning
                  </Typography>
                  <Button variant="contained" fullWidth>
                    Manage Diet
                  </Button>
                </CardContent>
              </Card>
            </GridComponent>
          </GridComponent>
        </TabPanel>
      </Paper>

      {/* Trainer Details Dialog */}
      <Dialog open={trainerDialogOpen} onClose={() => setTrainerDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={selectedTrainer?.image} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{selectedTrainer?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTrainer?.specialization}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTrainer && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" color="primary.main">
                    ${selectedTrainer.hourlyRate}/hour
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTrainer.experience} experience
                  </Typography>
                </Box>
                <Rating value={selectedTrainer.rating} precision={0.1} size="large" readOnly />
              </Box>
              <Divider sx={{ my: 2 }} />
              <GridComponent container spacing={2}>
                <GridComponent item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedTrainer.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedTrainer.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedTrainer.location}</Typography>
                  </Box>
                </GridComponent>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Availability
                  </Typography>
                  <Chip
                    label={selectedTrainer.available ? 'Available for Sessions' : 'Currently Booked'}
                    color={selectedTrainer.available ? 'success' : 'default'}
                    sx={{ mb: 1 }}
                  />
                  {selectedTrainer.available && (
                    <Typography variant="body2" color="text.secondary">
                      Ready to start training sessions
                    </Typography>
                  )}
                </GridComponent>
              </GridComponent>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrainerDialogOpen(false)}>Close</Button>
          {selectedTrainer?.available && (
            <Button variant="contained" color="primary">
              Book Session
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Gym Details Dialog */}
      <Dialog open={gymDialogOpen} onClose={() => setGymDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={selectedGym?.image} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{selectedGym?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedGym?.type}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGym && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" color="primary.main">
                    ${selectedGym.monthlyFee}/month
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedGym.hours}
                  </Typography>
                </Box>
                <Rating value={selectedGym.rating} precision={0.1} size="large" readOnly />
              </Box>
              <Divider sx={{ my: 2 }} />
              <GridComponent container spacing={2}>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedGym.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedGym.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedGym.location}</Typography>
                  </Box>
                </GridComponent>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Amenities
                  </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedGym.amenities.map((amenity: string, index: number) => (
                        <Chip key={index} label={amenity} size="small" />
                      ))}
                    </Box>
                </GridComponent>
              </GridComponent>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGymDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<Directions />}>
            Get Directions
          </Button>
          <Button variant="outlined" color="primary">
            Join Gym
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDashboard;
