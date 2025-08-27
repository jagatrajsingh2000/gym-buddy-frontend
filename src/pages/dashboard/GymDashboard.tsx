import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  Edit as EditIcon,
  Add as AddIcon,
  Business,
  Group as GroupIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Search
} from '@mui/icons-material';
import { Grid as GridComponent } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  specialization: string;
  clientsCount: number;
  rating: number;
  image: string;
  certification: string;
  experience: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  currentGoal: string;
  workoutsCompleted: number;
  lastWorkout: string;
  image: string;
  assignedTrainer?: string;
  membershipType: 'basic' | 'premium' | 'vip';
}

interface GymOperation {
  id: number;
  name: string;
  type: 'maintenance' | 'upgrade' | 'event' | 'staff';
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  description: string;
}

// Mock data for gym dashboard
const mockTrainers: Trainer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@gym.com',
    phone: '+1-555-0101',
    joinDate: '2023-06-15',
    status: 'active',
    specialization: 'Strength Training',
    clientsCount: 12,
    rating: 4.8,
    image: 'https://via.placeholder.com/60',
    certification: 'NASM Certified',
    experience: 5
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gym.com',
    phone: '+1-555-0102',
    joinDate: '2023-08-01',
    status: 'active',
    specialization: 'Yoga & Flexibility',
    clientsCount: 18,
    rating: 4.9,
    image: 'https://via.placeholder.com/60',
    certification: 'RYT-200',
    experience: 3
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@gym.com',
    phone: '+1-555-0103',
    joinDate: '2024-01-10',
    status: 'pending',
    specialization: 'Cardio & HIIT',
    clientsCount: 0,
    rating: 0,
    image: 'https://via.placeholder.com/60',
    certification: 'ACE Certified',
    experience: 2
  }
];

const mockClients: Client[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0201',
    joinDate: '2024-01-15',
    status: 'active',
    currentGoal: 'Weight Loss',
    workoutsCompleted: 24,
    lastWorkout: '2024-01-20',
    image: 'https://via.placeholder.com/60',
    assignedTrainer: 'John Smith',
    membershipType: 'premium'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-0202',
    joinDate: '2024-02-01',
    status: 'active',
    currentGoal: 'Muscle Building',
    workoutsCompleted: 12,
    lastWorkout: '2024-01-19',
    image: 'https://via.placeholder.com/60',
    assignedTrainer: 'John Smith',
    membershipType: 'basic'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+1-555-0203',
    joinDate: '2023-12-10',
    status: 'inactive',
    currentGoal: 'Strength Training',
    workoutsCompleted: 45,
    lastWorkout: '2024-01-10',
    image: 'https://via.placeholder.com/60',
    membershipType: 'vip'
  }
];

const mockGymOperations: GymOperation[] = [
  {
    id: 1,
    name: 'Equipment Maintenance',
    type: 'maintenance',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Maintenance Team',
    dueDate: '2024-01-25',
    description: 'Monthly equipment inspection and maintenance'
  },
  {
    id: 2,
    name: 'New Cardio Machines',
    type: 'upgrade',
    status: 'planned',
    priority: 'medium',
    assignedTo: 'Operations Manager',
    dueDate: '2024-02-15',
    description: 'Install 5 new treadmills and 3 ellipticals'
  },
  {
    id: 3,
    name: 'Staff Training Workshop',
    type: 'staff',
    status: 'planned',
    priority: 'low',
    assignedTo: 'HR Manager',
    dueDate: '2024-02-01',
    description: 'Quarterly staff training on safety protocols'
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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GymDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<GymOperation | null>(null);
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setTrainerDialogOpen(true);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientDialogOpen(true);
  };

  const handleOperationSelect = (operation: GymOperation) => {
    setSelectedOperation(operation);
    setOperationDialogOpen(true);
  };

  const filteredTrainers = mockTrainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.currentGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOperations = mockGymOperations.filter(operation =>
    operation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operation.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTrainers = mockTrainers.filter(t => t.status === 'active');
  const activeClients = mockClients.filter(c => c.status === 'active');
  const pendingOperations = mockGymOperations.filter(o => o.status === 'in_progress');

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1, md: 2 }, maxWidth: '100%' }}>
      <Typography variant="h4" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 600, color: 'text.primary' }}>
        Welcome, Gym Owner {user?.firstName}! 🏢
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 } }}>
        Manage your gym operations, trainers, clients, and system analytics
      </Typography>

      {/* Stats Cards */}
      <GridComponent container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <GroupIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {activeTrainers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Trainers
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <Person sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
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
            <Business sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {pendingOperations.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Operations
            </Typography>
          </Paper>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', height: '100%' }}>
            <SecurityIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              95%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Health
            </Typography>
          </Paper>
        </GridComponent>
      </GridComponent>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="gym dashboard tabs">
            <Tab label="Overview" />
            <Tab label="Manage Trainers" />
            <Tab label="Manage Clients" />
            <Tab label="Gym Operations" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <GridComponent container spacing={2}>
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    Recent Trainer Activity
                  </Typography>
                  {activeTrainers.slice(0, 3).length > 0 ? (
                    <List dense>
                      {activeTrainers.slice(0, 3).map((trainer) => (
                        <ListItem key={trainer.id} divider>
                          <ListItemIcon>
                            <Avatar src={trainer.image} sx={{ width: 32, height: 32 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={trainer.name}
                            secondary={`${trainer.specialization} • ${trainer.clientsCount} clients`}
                          />
                          <Chip
                            label={trainer.status}
                            color={trainer.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No trainers yet. Start building your team!
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
                      Manage Trainers
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Person />}
                      fullWidth
                      onClick={() => setTabValue(2)}
                    >
                      Manage Clients
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Business />}
                      fullWidth
                      onClick={() => setTabValue(3)}
                    >
                      Gym Operations
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      fullWidth
                      onClick={() => setTabValue(4)}
                    >
                      View Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>
          </GridComponent>
        </TabPanel>

        {/* Manage Trainers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Manage Trainers ({activeTrainers.length} active)
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add New Trainer
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search trainers by name, specialization, or status..."
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
            {filteredTrainers.map((trainer) => (
              <GridComponent item xs={12} md={6} key={trainer.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}
                  onClick={() => handleTrainerSelect(trainer)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={trainer.image} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {trainer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trainer.email}
                        </Typography>
                        <Chip
                          label={trainer.status}
                          color={trainer.status === 'active' ? 'success' : trainer.status === 'pending' ? 'warning' : 'default'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrainerSelect(trainer);
                        }}
                      >
                        <Person />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.specialization}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.clientsCount} clients
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit trainer
                        }}
                        fullWidth
                      >
                        Edit Trainer
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle assign clients
                        }}
                        fullWidth
                      >
                        Assign Clients
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </GridComponent>
            ))}
          </GridComponent>
        </TabPanel>

        {/* Manage Clients Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Manage Clients ({activeClients.length} active)
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
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit client
                        }}
                        fullWidth
                      >
                        Edit Client
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle assign trainer
                        }}
                        fullWidth
                      >
                        Assign Trainer
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </GridComponent>
            ))}
          </GridComponent>
        </TabPanel>

        {/* Gym Operations Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Gym Operations ({pendingOperations.length} pending)
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add New Operation
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search operations by name, type, or status..."
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
            {filteredOperations.map((operation) => (
              <GridComponent item xs={12} md={6} key={operation.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}
                  onClick={() => handleOperationSelect(operation)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {operation.name}
                      </Typography>
                      <Chip
                        label={operation.status}
                        color={operation.status === 'completed' ? 'success' : operation.status === 'in_progress' ? 'warning' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {operation.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Type: {operation.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {operation.dueDate}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit operation
                        }}
                        fullWidth
                      >
                        Edit Operation
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AssignmentIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle assign staff
                        }}
                        fullWidth
                      >
                        Assign Staff
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </GridComponent>
            ))}
          </GridComponent>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" sx={{ mb: 3 }}>System Analytics & Reports</Typography>
          
          <GridComponent container spacing={3}>
            {/* Revenue Overview */}
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Revenue Overview</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Revenue: $45,250
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Growth: +12.5% vs last month
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    75% of monthly target achieved
                  </Typography>
                </CardContent>
              </Card>
            </GridComponent>

            {/* Membership Stats */}
            <GridComponent item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Membership Distribution</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Basic: 45% (67 members)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium: 35% (52 members)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      VIP: 20% (30 members)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Basic" size="small" color="default" />
                    <Chip label="Premium" size="small" color="primary" />
                    <Chip label="VIP" size="small" color="secondary" />
                  </Box>
                </CardContent>
              </Card>
            </GridComponent>

            {/* Trainer Performance */}
            <GridComponent item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Trainer Performance</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {activeTrainers.map((trainer) => (
                      <Box key={trainer.id} sx={{ textAlign: 'center', minWidth: 120 }}>
                        <Avatar src={trainer.image} sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{trainer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trainer.clientsCount} clients • {trainer.rating}★
                        </Typography>
                      </Box>
                    ))}
                  </Box>
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
                Trainer since {selectedTrainer?.joinDate}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTrainer && (
            <Box>
              <GridComponent container spacing={2}>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedTrainer.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedTrainer.email}</Typography>
                  </Box>
                </GridComponent>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Professional Details
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Specialization:</strong> {selectedTrainer.specialization}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Certification:</strong> {selectedTrainer.certification}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Experience:</strong> {selectedTrainer.experience} years
                  </Typography>
                </GridComponent>
              </GridComponent>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Performance Metrics
                </Typography>
                <GridComponent container spacing={2}>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Active Clients</Typography>
                    <Typography variant="h6">{selectedTrainer.clientsCount}</Typography>
                  </GridComponent>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Rating</Typography>
                    <Typography variant="h6">{selectedTrainer.rating}★</Typography>
                  </GridComponent>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{selectedTrainer.status}</Typography>
                  </GridComponent>
                </GridComponent>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrainerDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Trainer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Details Dialog */}
      <Dialog open={clientDialogOpen} onClose={() => setClientDialogOpen(false)} maxWidth="md" fullWidth>
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
                    Membership Details
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Goal:</strong> {selectedClient.currentGoal}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Membership:</strong> {selectedClient.membershipType.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Assigned Trainer:</strong> {selectedClient.assignedTrainer || 'None'}
                  </Typography>
                </GridComponent>
              </GridComponent>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Activity Summary
                </Typography>
                <GridComponent container spacing={2}>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Workouts Completed</Typography>
                    <Typography variant="h6">{selectedClient.workoutsCompleted}</Typography>
                  </GridComponent>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Last Workout</Typography>
                    <Typography variant="h6">{selectedClient.lastWorkout}</Typography>
                  </GridComponent>
                  <GridComponent item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{selectedClient.status}</Typography>
                  </GridComponent>
                </GridComponent>
              </Box>
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

      {/* Operation Details Dialog */}
      <Dialog open={operationDialogOpen} onClose={() => setOperationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{selectedOperation?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOperation?.type} Operation
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOperation && (
            <Box>
              <GridComponent container spacing={2}>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Operation Details
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {selectedOperation.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Priority:</strong> {selectedOperation.priority}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Due Date:</strong> {selectedOperation.dueDate}
                  </Typography>
                </GridComponent>
                <GridComponent item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Assignment
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Assigned To:</strong> {selectedOperation.assignedTo}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Status:</strong> {selectedOperation.status}
                  </Typography>
                </GridComponent>
              </GridComponent>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography variant="body2">
                  {selectedOperation.description}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOperationDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Operation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GymDashboard;
