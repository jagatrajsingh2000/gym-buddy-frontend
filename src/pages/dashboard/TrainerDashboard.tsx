import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip, CircularProgress, Alert,
  TextField, InputAdornment, Button, Grid, Avatar, Rating, Divider, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, LinearProgress
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  FitnessCenter, TrendingUp, CalendarToday, CheckCircle, Schedule, Search, LocationOn, Person,
  Phone, Email, Directions, Add as AddIcon, Edit as EditIcon, Assignment as AssignmentIcon,
  Group as GroupIcon, Restaurant
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { workoutService, Workout } from '../../services/workoutService';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  workoutsCompleted: number;
  currentGoal: string;
  lastWorkout: string;
  image: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Mock data for clients and gyms
const mockClients = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0201',
    joinDate: '2024-01-15',
    status: 'active',
    workoutsCompleted: 24,
    currentGoal: 'Weight Loss',
    lastWorkout: '2024-01-20',
    image: 'https://via.placeholder.com/60',
    currentWeight: 68,
    targetWeight: 60,
    height: 165,
    age: 28,
    fitnessLevel: 'intermediate'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-0202',
    joinDate: '2024-02-01',
    status: 'active',
    workoutsCompleted: 12,
    currentGoal: 'Muscle Building',
    lastWorkout: '2024-01-19',
    image: 'https://via.placeholder.com/60',
    currentWeight: 75,
    targetWeight: 80,
    height: 180,
    age: 32,
    fitnessLevel: 'beginner'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+1-555-0203',
    joinDate: '2023-12-10',
    status: 'inactive',
    workoutsCompleted: 45,
    currentGoal: 'Strength Training',
    lastWorkout: '2024-01-10',
    image: 'https://via.placeholder.com/60',
    currentWeight: 62,
    targetWeight: 62,
    height: 170,
    age: 35,
    fitnessLevel: 'advanced'
  }
];

interface ClientWorkout {
  id: number;
  name: string;
  date: string;
  duration: number;
  status: string;
  calories: number;
}

// Mock client workout data
const mockClientWorkouts: Record<number, ClientWorkout[]> = {
  1: [ // Alice's workouts
    { id: 1, name: 'Weight Loss Circuit', date: '2024-01-20', duration: 45, status: 'completed', calories: 320 },
    { id: 2, name: 'Cardio Blast', date: '2024-01-18', duration: 30, status: 'completed', calories: 280 },
    { id: 3, name: 'Strength Training', date: '2024-01-15', duration: 60, status: 'completed', calories: 250 }
  ],
  2: [ // Bob's workouts
    { id: 4, name: 'Muscle Building Plan', date: '2024-01-19', duration: 75, status: 'completed', calories: 180 },
    { id: 5, name: 'Strength Focus', date: '2024-01-16', duration: 60, status: 'completed', calories: 150 }
  ],
  3: [ // Carol's workouts
    { id: 6, name: 'Advanced Strength', date: '2024-01-10', duration: 90, status: 'completed', calories: 200 }
  ]
};

interface ClientDiet {
  id: number;
  name: string;
  type: string;
  calories: number;
  status: string;
  startDate: string;
}

// Mock client diet data
const mockClientDiets: Record<number, ClientDiet[]> = {
  1: [ // Alice's diet plans
    { id: 1, name: 'Weight Loss Plan', type: 'full_day', calories: 1800, status: 'active', startDate: '2024-01-01' },
    { id: 2, name: 'High Protein Plan', type: 'full_day', calories: 2000, status: 'completed', startDate: '2023-12-01' }
  ],
  2: [ // Bob's diet plans
    { id: 3, name: 'Muscle Gain Plan', type: 'full_day', calories: 2800, status: 'active', startDate: '2024-01-15' }
  ],
  3: [ // Carol's diet plans
    { id: 4, name: 'Maintenance Plan', type: 'full_day', calories: 2200, status: 'completed', startDate: '2023-11-01' }
  ]
};

interface ClientProgress {
  weight: number[];
  bodyFat: number[];
  muscleMass: number[];
  dates: string[];
}

// Mock client progress data
const mockClientProgress: Record<number, ClientProgress> = {
  1: { // Alice's progress
    weight: [72, 71, 70, 69, 68],
    bodyFat: [25, 24, 23, 22, 21],
    muscleMass: [45, 46, 47, 48, 49],
    dates: ['2023-12-01', '2023-12-15', '2024-01-01', '2024-01-15', '2024-01-20']
  },
  2: { // Bob's progress
    weight: [70, 71, 72, 73, 74, 75],
    bodyFat: [18, 18, 19, 19, 20, 20],
    muscleMass: [52, 53, 54, 55, 56, 57],
    dates: ['2023-12-01', '2023-12-15', '2024-01-01', '2024-01-15', '2024-01-19']
  },
  3: { // Carol's progress
    weight: [62, 62, 62, 62, 62],
    bodyFat: [15, 15, 14, 14, 14],
    muscleMass: [58, 59, 60, 61, 62],
    dates: ['2023-11-01', '2023-11-15', '2023-12-01', '2023-12-15', '2024-01-10']
  }
};

const mockGyms = [
  {
    id: 1,
    name: 'Downtown Fitness Center',
    type: 'Full Service',
    rating: 4.6,
    location: '123 Main St, Downtown',
    hours: '24/7',
    phone: '+1-555-0001',
    email: 'info@downtownfitness.com',
    amenities: ['Cardio Equipment', 'Weight Room', 'Pool', 'Spa'],
    monthlyFee: 89,
    trainerDiscount: 15,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 2,
    name: 'Elite Training Facility',
    type: 'Premium',
    rating: 4.8,
    location: '456 Oak Ave, Midtown',
    hours: '5AM-11PM',
    phone: '+1-555-0002',
    email: 'info@elitetraining.com',
    amenities: ['Personal Training Rooms', 'Group Classes', 'Sauna', 'Nutrition Center'],
    monthlyFee: 129,
    trainerDiscount: 20,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 3,
    name: 'Community Wellness Hub',
    type: 'Community',
    rating: 4.4,
    location: '789 Pine St, Uptown',
    hours: '6AM-10PM',
    phone: '+1-555-0003',
    email: 'info@communitywellness.com',
    amenities: ['Yoga Studio', 'Meditation Room', 'Basketball Court', 'Rock Climbing'],
    monthlyFee: 65,
    trainerDiscount: 10,
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
      id={`trainer-tabpanel-${index}`}
      aria-labelledby={`trainer-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TrainerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [gymDialogOpen, setGymDialogOpen] = useState(false);
  const [assignWorkoutDialogOpen, setAssignWorkoutDialogOpen] = useState(false);
  const [assignDietDialogOpen, setAssignDietDialogOpen] = useState(false);
  const [clientDialogTab, setClientDialogTab] = useState(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const workoutData = await workoutService.getUserWorkouts(token!);
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

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientDialogOpen(true);
  };

  const handleGymSelect = (gym: any) => {
    setSelectedGym(gym);
    setGymDialogOpen(true);
  };

  const handleAssignWorkout = (client: any) => {
    setSelectedClient(client);
    setAssignWorkoutDialogOpen(true);
  };

  const handleAssignDiet = (client: any) => {
    setSelectedClient(client);
    setAssignDietDialogOpen(true);
  };

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.currentGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGyms = mockGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClients = mockClients.filter(c => c.status === 'active');
  const totalWorkouts = mockClients.reduce((total, client) => total + client.workoutsCompleted, 0);

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
        Welcome back, Trainer {user?.firstName}! 🏋️‍♂️
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 } }}>
        Manage your clients, create workout plans, and grow your training business
      </Typography>

      {/* Stats Cards */}
      <GridComponent container spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <GroupIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {activeClients.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Clients
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <FitnessCenter sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {totalWorkouts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Client Workouts
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {workouts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Workout Plans
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <CheckCircle sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              95%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Success Rate
            </Typography>
          </Paper>
        </GridComponent>
      </GridComponent>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="trainer dashboard tabs">
            <Tab label="Overview" />
            <Tab label="My Clients" />
            <Tab label="Find Gyms" />
            <Tab label="Create Plans" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <GridComponent container spacing={1}>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    Recent Client Activity
                  </Typography>
                  {activeClients.slice(0, 3).length > 0 ? (
                    <List dense>
                      {activeClients.slice(0, 3).map((client) => (
                        <ListItem key={client.id} divider>
                          <ListItemIcon>
                            <Avatar src={client.image} sx={{ width: 32, height: 32 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={client.name}
                            secondary={`${client.workoutsCompleted} workouts • ${client.currentGoal}`}
                          />
                          <Chip
                            label={client.status}
                            color={client.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No clients yet. Start building your client base!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </GridComponent>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ mr: 1 }} />
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<GroupIcon />}
                      fullWidth
                      onClick={() => setTabValue(1)}
                    >
                      Manage Clients
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<FitnessCenter />}
                      fullWidth
                      onClick={() => setTabValue(3)}
                    >
                      Create Workout Plan
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Restaurant />}
                      fullWidth
                      onClick={() => setTabValue(3)}
                    >
                      Create Diet Plan
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LocationOn />}
                      fullWidth
                      onClick={() => setTabValue(2)}
                    >
                      Find Partner Gyms
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>
          </GridComponent>
        </TabPanel>

        {/* My Clients Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                My Clients ({activeClients.length} active)
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add New Client
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search clients by name, email, or goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>

          <GridComponent container spacing={2}>
            {filteredClients.map((client) => (
              <GridComponent item xs={12} md={6} key={client.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}
                  onClick={() => handleClientSelect(client)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={client.image} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {client.email}
                        </Typography>
                        <Chip
                          label={client.status}
                          color={client.status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientSelect(client);
                        }}
                      >
                        <Person />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Goal: {client.currentGoal}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.workoutsCompleted} workouts
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FitnessCenter />}
                        onClick={() => handleAssignWorkout(client)}
                        fullWidth
                      >
                        Assign Workout
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Restaurant />}
                        onClick={() => handleAssignDiet(client)}
                        fullWidth
                      >
                        Assign Diet
                      </Button>
                    </Box>
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
              Partner Gyms & Facilities
            </Typography>
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
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary.main">
                          ${gym.monthlyFee}/month
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          {gym.trainerDiscount}% trainer discount
                        </Typography>
                      </Box>
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

        {/* Create Plans Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Training & Nutrition Plans
          </Typography>
          <GridComponent container spacing={2}>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <FitnessCenter sx={{ mr: 1 }} />
                    Workout Plan Builder
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create customized workout routines for your clients based on their goals and fitness level
                  </Typography>
                  <Button variant="contained" fullWidth sx={{ mb: 2 }}>
                    Create New Workout Plan
                  </Button>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Quick Templates:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" size="small">Weight Loss Program</Button>
                    <Button variant="outlined" size="small">Muscle Building Plan</Button>
                    <Button variant="outlined" size="small">Strength Training</Button>
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Restaurant sx={{ mr: 1 }} />
                    Diet Plan Builder
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Design personalized nutrition plans that complement your clients' workout routines
                  </Typography>
                  <Button variant="contained" fullWidth sx={{ mb: 2 }}>
                    Create New Diet Plan
                  </Button>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Quick Templates:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" size="small">High Protein Plan</Button>
                    <Button variant="outlined" size="small">Cutting Diet</Button>
                    <Button variant="outlined" size="small">Bulking Plan</Button>
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>
          </GridComponent>
        </TabPanel>
      </Paper>

      {/* Client Details Dialog */}
      <Dialog open={clientDialogOpen} onClose={() => setClientDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={selectedClient?.image} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{selectedClient?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Client since {selectedClient?.joinDate}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box>
              <Tabs value={clientDialogTab} onChange={(e, newValue) => setClientDialogTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Workouts" />
                <Tab label="Diet Plans" />
                <Tab label="Progress" />
              </Tabs>

              {/* Overview Tab */}
              {clientDialogTab === 0 && (
                <Box>
                  <GridComponent container spacing={2}>
                    <GridComponent item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedClient.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedClient.email}</Typography>
                      </Box>
                    </GridComponent>
                    <GridComponent item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Progress Summary
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Current Goal:</strong> {selectedClient.currentGoal}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Workouts Completed:</strong> {selectedClient.workoutsCompleted}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Last Workout:</strong> {selectedClient.lastWorkout}
                      </Typography>
                    </GridComponent>
                  </GridComponent>

                  {/* Client Stats */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Current Stats
                    </Typography>
                    <GridComponent container spacing={2}>
                      <GridComponent item xs={12} sm={3}>
                        <Typography variant="body2" color="text.secondary">Current Weight</Typography>
                        <Typography variant="h6">{selectedClient.currentWeight} kg</Typography>
                      </GridComponent>
                      <GridComponent item xs={12} sm={3}>
                        <Typography variant="body2" color="text.secondary">Target Weight</Typography>
                        <Typography variant="h6">{selectedClient.targetWeight} kg</Typography>
                      </GridComponent>
                      <GridComponent item xs={12} sm={3}>
                        <Typography variant="body2" color="text.secondary">Height</Typography>
                        <Typography variant="h6">{selectedClient.height} cm</Typography>
                      </GridComponent>
                      <GridComponent item xs={12} sm={3}>
                        <Typography variant="body2" color="text.secondary">Fitness Level</Typography>
                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{selectedClient.fitnessLevel}</Typography>
                      </GridComponent>
                    </GridComponent>
                  </Box>

                  {/* Quick Actions */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Quick Actions
                    </Typography>
                    <GridComponent container spacing={2}>
                      <GridComponent item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          startIcon={<FitnessCenter />}
                          fullWidth
                          onClick={() => {
                            setClientDialogOpen(false);
                            setTabValue(3); // Go to Create Plans tab
                          }}
                        >
                          Create Workout
                        </Button>
                      </GridComponent>
                      <GridComponent item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          startIcon={<Restaurant />}
                          fullWidth
                          onClick={() => {
                            setClientDialogOpen(false);
                            setTabValue(3); // Go to Create Plans tab
                          }}
                        >
                          Create Diet Plan
                        </Button>
                      </GridComponent>
                      <GridComponent item xs={12} sm={4}>
                        <Button
                          variant="outlined"
                          startIcon={<TrendingUp />}
                          fullWidth
                          onClick={() => setClientDialogTab(3)}
                        >
                          View Progress
                        </Button>
                      </GridComponent>
                    </GridComponent>
                  </Box>
                </Box>
              )}

              {/* Workouts Tab */}
              {clientDialogTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Client Workouts</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setClientDialogOpen(false);
                        setTabValue(3);
                      }}
                    >
                      Assign New Workout
                    </Button>
                  </Box>
                  
                  {mockClientWorkouts[selectedClient.id]?.length > 0 ? (
                    <GridComponent container spacing={2}>
                      {mockClientWorkouts[selectedClient.id].map((workout) => (
                        <GridComponent item xs={12} md={6} key={workout.id}>
                          <Card>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {workout.name}
                                </Typography>
                                <Chip
                                  label={workout.status}
                                  color={workout.status === 'completed' ? 'success' : 'warning'}
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {workout.date} • {workout.duration} min • {workout.calories} cal
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                                  Edit
                                </Button>
                                <Button variant="outlined" size="small" startIcon={<AssignmentIcon />}>
                                  Reassign
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </GridComponent>
                      ))}
                    </GridComponent>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <FitnessCenter sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">No workouts assigned yet</Typography>
                      <Typography variant="body2">Assign a workout plan to get started</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Diet Plans Tab */}
              {clientDialogTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Client Diet Plans</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setClientDialogOpen(false);
                        setTabValue(3);
                      }}
                    >
                      Assign New Diet
                    </Button>
                  </Box>
                  
                  {mockClientDiets[selectedClient.id]?.length > 0 ? (
                    <GridComponent container spacing={2}>
                      {mockClientDiets[selectedClient.id].map((diet) => (
                        <GridComponent item xs={12} md={6} key={diet.id}>
                          <Card>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {diet.name}
                                </Typography>
                                <Chip
                                  label={diet.status}
                                  color={diet.status === 'active' ? 'success' : 'default'}
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {diet.type.replace('_', ' ')} • {diet.calories} cal • Started {diet.startDate}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                                  Edit
                                </Button>
                                <Button variant="outlined" size="small" startIcon={<AssignmentIcon />}>
                                  Reassign
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </GridComponent>
                      ))}
                    </GridComponent>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <Restaurant sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">No diet plans assigned yet</Typography>
                      <Typography variant="body2">Assign a diet plan to get started</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Progress Tab */}
              {clientDialogTab === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>Client Progress Tracking</Typography>
                  
                  {mockClientProgress[selectedClient.id] ? (
                    <GridComponent container spacing={3}>
                      {/* Weight Progress */}
                      <GridComponent item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Weight Progress</Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Current: {selectedClient.currentWeight} kg
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Target: {selectedClient.targetWeight} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 80 }}>Progress:</Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Math.max(0, ((selectedClient.currentWeight - selectedClient.targetWeight) / (selectedClient.currentWeight - selectedClient.targetWeight)) * 100))}
                                sx={{ flexGrow: 1, mr: 2 }}
                              />
                              <Typography variant="body2">
                                {Math.abs(selectedClient.currentWeight - selectedClient.targetWeight)} kg to go
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </GridComponent>

                      {/* Body Composition */}
                      <GridComponent item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Body Composition</Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Body Fat: {mockClientProgress[selectedClient.id].bodyFat[mockClientProgress[selectedClient.id].bodyFat.length - 1]}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Muscle Mass: {mockClientProgress[selectedClient.id].muscleMass[mockClientProgress[selectedClient.id].muscleMass.length - 1]} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 2 }}>Trend:</Typography>
                              <Typography variant="body2" color="success.main">
                                {mockClientProgress[selectedClient.id].bodyFat[mockClientProgress[selectedClient.id].bodyFat.length - 1] < mockClientProgress[selectedClient.id].bodyFat[0] ? 'Improving' : 'Needs attention'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </GridComponent>

                      {/* Recent Progress */}
                      <GridComponent item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Recent Progress</Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              {mockClientProgress[selectedClient.id].dates.slice(-3).map((date, index) => (
                                <Box key={date} sx={{ textAlign: 'center', minWidth: 100 }}>
                                  <Typography variant="body2" color="text.secondary">{date}</Typography>
                                  <Typography variant="h6">{mockClientProgress[selectedClient.id].weight[mockClientProgress[selectedClient.id].weight.length - 3 + index]} kg</Typography>
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </GridComponent>
                    </GridComponent>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <TrendingUp sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">No progress data available</Typography>
                      <Typography variant="body2">Progress will appear here as the client uses the platform</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClientDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Client
          </Button>
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
                {selectedGym?.type} Facility
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
                  <Typography variant="body2" color="success.main">
                    {selectedGym.trainerDiscount}% trainer discount available
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
                    Amenities & Features
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
            Partner Inquiry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Workout Dialog */}
      <Dialog open={assignWorkoutDialogOpen} onClose={() => setAssignWorkoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Workout to {selectedClient?.name}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Workout Plan</InputLabel>
            <Select
              label="Select Workout Plan"
              defaultValue=""
            >
              <MenuItem value="strength">Strength Training Plan</MenuItem>
              <MenuItem value="cardio">Cardio Blast Program</MenuItem>
              <MenuItem value="weight-loss">Weight Loss Circuit</MenuItem>
              <MenuItem value="muscle-building">Muscle Building Plan</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notes for Client"
            multiline
            rows={3}
            sx={{ mt: 2 }}
            placeholder="Add any specific instructions or modifications..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignWorkoutDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Assign Workout</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Diet Dialog */}
      <Dialog open={assignDietDialogOpen} onClose={() => setAssignDietDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Diet Plan to {selectedClient?.name}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Diet Plan</InputLabel>
            <Select
              label="Select Diet Plan"
              defaultValue=""
            >
              <MenuItem value="high-protein">High Protein Plan</MenuItem>
              <MenuItem value="weight-loss">Weight Loss Diet</MenuItem>
              <MenuItem value="muscle-gain">Muscle Gain Plan</MenuItem>
              <MenuItem value="balanced">Balanced Nutrition</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Dietary Notes"
            multiline
            rows={3}
            sx={{ mt: 2 }}
            placeholder="Any allergies, preferences, or special instructions..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDietDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Assign Diet Plan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerDashboard;
