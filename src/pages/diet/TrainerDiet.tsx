import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Chip,
  List, ListItem, ListItemText, Divider, Alert, CircularProgress, Switch, FormControlLabel,
  Avatar, Autocomplete
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  Restaurant, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon,
  Save as SaveIcon, Cancel as CancelIcon, Person, Group as GroupIcon, AccessTime, Scale
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timing: string;
  notes: string;
}

interface DietPlan {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout' | 'full_day';
  targetGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'cutting' | 'bulking';
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    id: string;
    name: string;
    timing: string;
    foods: FoodItem[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  assignedClients: string[];
  isTemplate: boolean;
  duration: number; // days
  notes: string;
  createdAt: string;
}

interface DietForm {
  id?: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout' | 'full_day';
  targetGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'cutting' | 'bulking';
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  duration: number;
  notes: string;
  isTemplate: boolean;
}

// Mock clients data
const mockClients = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', goal: 'weight_loss' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', goal: 'muscle_gain' },
  { id: '3', name: 'Carol Davis', email: 'carol@email.com', goal: 'maintenance' },
  { id: '4', name: 'David Wilson', email: 'david@email.com', goal: 'cutting' }
];

const TrainerDiet: React.FC = () => {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<DietForm | null>(null);
  const [selectedDietForAssign, setSelectedDietForAssign] = useState<DietPlan | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [dietForm, setDietForm] = useState<DietForm>({
    name: '',
    description: '',
    type: 'full_day',
    targetGoal: 'maintenance',
    dailyCalories: 2000,
    macroSplit: {
      protein: 25,
      carbs: 45,
      fat: 30
    },
    duration: 7,
    notes: '',
    isTemplate: false
  });

  useEffect(() => {
    const loadDietPlans = () => {
      // Mock data for trainer diet plans
      const mockPlans: DietPlan[] = [
        {
          id: '1',
          name: 'Weight Loss Plan - High Protein',
          description: 'A high-protein, calorie-controlled diet plan for effective weight loss',
          type: 'full_day',
          targetGoal: 'weight_loss',
          dailyCalories: 1800,
          macroSplit: {
            protein: 35,
            carbs: 35,
            fat: 30
          },
          meals: [
            {
              id: '1',
              name: 'Breakfast',
              timing: '7:00 AM',
              foods: [
                {
                  id: '1',
                  name: 'Greek Yogurt',
                  quantity: '200g',
                  calories: 150,
                  protein: 20,
                  carbs: 8,
                  fat: 5,
                  timing: '7:00 AM',
                  notes: 'Plain, low-fat'
                }
              ],
              calories: 400,
              protein: 30,
              carbs: 25,
              fat: 12
            },
            {
              id: '2',
              name: 'Lunch',
              timing: '12:30 PM',
              foods: [
                {
                  id: '2',
                  name: 'Grilled Chicken Breast',
                  quantity: '150g',
                  calories: 250,
                  protein: 45,
                  carbs: 0,
                  fat: 5,
                  timing: '12:30 PM',
                  notes: 'Seasoned with herbs'
                }
              ],
              calories: 500,
              protein: 50,
              carbs: 30,
              fat: 15
            }
          ],
          assignedClients: ['1', '4'],
          isTemplate: true,
          duration: 14,
          notes: 'Drink plenty of water throughout the day',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Muscle Gain - High Calorie',
          description: 'Calorie surplus diet plan optimized for muscle building',
          type: 'full_day',
          targetGoal: 'muscle_gain',
          dailyCalories: 2800,
          macroSplit: {
            protein: 30,
            carbs: 45,
            fat: 25
          },
          meals: [
            {
              id: '3',
              name: 'Pre-Workout',
              timing: '5:30 PM',
              foods: [
                {
                  id: '3',
                  name: 'Banana',
                  quantity: '1 medium',
                  calories: 105,
                  protein: 1,
                  carbs: 27,
                  fat: 0,
                  timing: '5:30 PM',
                  notes: 'Quick energy source'
                }
              ],
              calories: 300,
              protein: 15,
              carbs: 50,
              fat: 8
            }
          ],
          assignedClients: ['2'],
          isTemplate: true,
          duration: 21,
          notes: 'Eat every 3-4 hours for optimal muscle growth',
          createdAt: '2024-01-10'
        }
      ];
      setDietPlans(mockPlans);
      setLoading(false);
    };

    loadDietPlans();
  }, []);

  const handleOpenDialog = (diet?: DietPlan) => {
    if (diet) {
      setEditingDiet({
        id: diet.id,
        name: diet.name,
        description: diet.description,
        type: diet.type,
        targetGoal: diet.targetGoal,
        dailyCalories: diet.dailyCalories,
        macroSplit: diet.macroSplit,
        duration: diet.duration,
        notes: diet.notes,
        isTemplate: diet.isTemplate
      });
      setDietForm({
        id: diet.id,
        name: diet.name,
        description: diet.description,
        type: diet.type,
        targetGoal: diet.targetGoal,
        dailyCalories: diet.dailyCalories,
        macroSplit: diet.macroSplit,
        duration: diet.duration,
        notes: diet.notes,
        isTemplate: diet.isTemplate
      });
    } else {
      setEditingDiet(null);
      setDietForm({
        name: '',
        description: '',
        type: 'full_day',
        targetGoal: 'maintenance',
        dailyCalories: 2000,
        macroSplit: {
          protein: 25,
          carbs: 45,
          fat: 30
        },
        duration: 7,
        notes: '',
        isTemplate: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDiet(null);
  };

  const handleSaveDiet = () => {
    if (!dietForm.name.trim()) return;

    if (editingDiet) {
      // Update existing diet
      setDietPlans(prev => prev.map(plan => 
        plan.id === dietForm.id 
          ? { 
              ...plan, 
              ...dietForm,
              macroSplit: dietForm.macroSplit
            }
          : plan
      ));
    } else {
      // Create new diet
      const newPlan: DietPlan = {
        id: Date.now().toString(),
        name: dietForm.name,
        description: dietForm.description,
        type: dietForm.type,
        targetGoal: dietForm.targetGoal,
        dailyCalories: dietForm.dailyCalories,
        macroSplit: dietForm.macroSplit,
        meals: [], // Will be populated when adding meals
        assignedClients: [],
        isTemplate: dietForm.isTemplate,
        duration: dietForm.duration,
        notes: dietForm.notes,
        createdAt: new Date().toISOString()
      };
      setDietPlans(prev => [...prev, newPlan]);
    }

    handleCloseDialog();
  };

  const handleDeleteDiet = (dietId: string) => {
    setDietPlans(prev => prev.filter(plan => plan.id !== dietId));
  };

  const handleAssignDiet = (diet: DietPlan) => {
    setSelectedDietForAssign(diet);
    setSelectedClients(diet.assignedClients);
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    if (selectedDietForAssign) {
      setDietPlans(prev => prev.map(plan => 
        plan.id === selectedDietForAssign.id 
          ? { ...plan, assignedClients: selectedClients }
          : plan
      ));
    }
    setAssignDialogOpen(false);
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'error';
      case 'muscle_gain': return 'primary';
      case 'maintenance': return 'success';
      case 'cutting': return 'warning';
      case 'bulking': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'success';
      case 'lunch': return 'primary';
      case 'dinner': return 'secondary';
      case 'snack': return 'warning';
      case 'pre_workout': return 'info';
      case 'post_workout': return 'error';
      case 'full_day': return 'default';
      default: return 'default';
    }
  };

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
    <Box sx={{ p: { xs: 0.5, sm: 1, md: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Diet Plans 🍎
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage nutrition plans for your clients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 140 }}
        >
          Create Plan
        </Button>
      </Box>

      {/* Summary Cards */}
      <GridComponent container spacing={2} sx={{ mb: 3 }}>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Restaurant sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {dietPlans.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Plans
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {dietPlans.reduce((total, plan) => total + plan.assignedClients.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Assignments
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {dietPlans.filter(plan => plan.isTemplate).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Templates
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Scale sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {Math.round(dietPlans.reduce((total, plan) => total + plan.dailyCalories, 0) / dietPlans.length) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Daily Calories
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
      </GridComponent>

      {/* Diet Plans */}
      <GridComponent container spacing={2}>
        {dietPlans.map((plan) => (
          <GridComponent item xs={12} md={6} lg={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {plan.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(plan)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteDiet(plan.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={plan.targetGoal.replace('_', ' ')}
                    color={getGoalColor(plan.targetGoal) as any}
                    size="small"
                  />
                  <Chip
                    label={plan.type.replace('_', ' ')}
                    color={getTypeColor(plan.type) as any}
                    size="small"
                  />
                  {plan.isTemplate && (
                    <Chip
                      label="Template"
                      variant="outlined"
                      size="small"
                      color="info"
                    />
                  )}
                </Box>

                {/* Nutrition Summary */}
                <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Daily Nutrition:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Calories:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {plan.dailyCalories}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`P: ${plan.macroSplit.protein}%`} size="small" variant="outlined" />
                    <Chip label={`C: ${plan.macroSplit.carbs}%`} size="small" variant="outlined" />
                    <Chip label={`F: ${plan.macroSplit.fat}%`} size="small" variant="outlined" />
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${plan.duration} days`}
                    variant="outlined"
                    size="small"
                    icon={<AccessTime />}
                  />
                  <Chip
                    label={`${plan.meals.length} meals`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Assigned to {plan.assignedClients.length} clients
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleAssignDiet(plan)}
                  fullWidth
                >
                  Assign to Clients
                </Button>
              </CardContent>
            </Card>
          </GridComponent>
        ))}
      </GridComponent>

      {/* Create/Edit Diet Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDiet ? 'Edit Diet Plan' : 'Create New Diet Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <GridComponent container spacing={2}>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plan Name"
                  value={dietForm.name}
                  onChange={(e) => setDietForm(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Daily Calories"
                  type="number"
                  value={dietForm.dailyCalories}
                  onChange={(e) => setDietForm(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) || 2000 }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Diet Type</InputLabel>
                  <Select
                    value={dietForm.type}
                    label="Diet Type"
                    onChange={(e) => setDietForm(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <MenuItem value="full_day">Full Day Plan</MenuItem>
                    <MenuItem value="breakfast">Breakfast Only</MenuItem>
                    <MenuItem value="lunch">Lunch Only</MenuItem>
                    <MenuItem value="dinner">Dinner Only</MenuItem>
                    <MenuItem value="snack">Snack Plan</MenuItem>
                    <MenuItem value="pre_workout">Pre-Workout</MenuItem>
                    <MenuItem value="post_workout">Post-Workout</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Target Goal</InputLabel>
                  <Select
                    value={dietForm.targetGoal}
                    label="Target Goal"
                    onChange={(e) => setDietForm(prev => ({ ...prev, targetGoal: e.target.value as any }))}
                  >
                    <MenuItem value="weight_loss">Weight Loss</MenuItem>
                    <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="cutting">Cutting</MenuItem>
                    <MenuItem value="bulking">Bulking</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration (days)"
                  type="number"
                  value={dietForm.duration}
                  onChange={(e) => setDietForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 7 }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={dietForm.description}
                  onChange={(e) => setDietForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
            </GridComponent>

            {/* Macro Split */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Macro Split (%)
              </Typography>
              <GridComponent container spacing={2}>
                <GridComponent item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Protein %"
                    type="number"
                    value={dietForm.macroSplit.protein}
                    onChange={(e) => setDietForm(prev => ({
                      ...prev,
                      macroSplit: { ...prev.macroSplit, protein: parseInt(e.target.value) || 0 }
                    }))}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </GridComponent>
                <GridComponent item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Carbs %"
                    type="number"
                    value={dietForm.macroSplit.carbs}
                    onChange={(e) => setDietForm(prev => ({
                      ...prev,
                      macroSplit: { ...prev.macroSplit, carbs: parseInt(e.target.value) || 0 }
                    }))}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </GridComponent>
                <GridComponent item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Fat %"
                    type="number"
                    value={dietForm.macroSplit.fat}
                    onChange={(e) => setDietForm(prev => ({
                      ...prev,
                      macroSplit: { ...prev.macroSplit, fat: parseInt(e.target.value) || 0 }
                    }))}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </GridComponent>
              </GridComponent>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Total: {dietForm.macroSplit.protein + dietForm.macroSplit.carbs + dietForm.macroSplit.fat}%
                {dietForm.macroSplit.protein + dietForm.macroSplit.carbs + dietForm.macroSplit.fat !== 100 && (
                  <span style={{ color: 'red' }}> (Should equal 100%)</span>
                )}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              value={dietForm.notes}
              onChange={(e) => setDietForm(prev => ({ ...prev, notes: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={dietForm.isTemplate}
                  onChange={(e) => setDietForm(prev => ({ ...prev, isTemplate: e.target.checked }))}
                />
              }
              label="Save as Template"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDiet}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!dietForm.name.trim() || dietForm.macroSplit.protein + dietForm.macroSplit.carbs + dietForm.macroSplit.fat !== 100}
          >
            {editingDiet ? 'Update' : 'Create'} Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Diet Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign "{selectedDietForAssign?.name}" to Clients
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select clients to assign this diet plan to:
          </Typography>
          <Autocomplete
            multiple
            options={mockClients}
            getOptionLabel={(option) => option.name}
            value={mockClients.filter(client => selectedClients.includes(client.id))}
            onChange={(event, newValue) => {
              setSelectedClients(newValue.map(client => client.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Clients"
                placeholder="Choose clients..."
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
          
          {selectedDietForAssign && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Diet Summary:
              </Typography>
              <Typography variant="body2">
                <strong>Target Goal:</strong> {selectedDietForAssign.targetGoal.replace('_', ' ')}
              </Typography>
              <Typography variant="body2">
                <strong>Daily Calories:</strong> {selectedDietForAssign.dailyCalories}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {selectedDietForAssign.duration} days
              </Typography>
              <Typography variant="body2">
                <strong>Macros:</strong> P:{selectedDietForAssign.macroSplit.protein}% 
                C:{selectedDietForAssign.macroSplit.carbs}% F:{selectedDietForAssign.macroSplit.fat}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveAssignment}
            variant="contained"
            startIcon={<AssignmentIcon />}
          >
            Assign Diet Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerDiet;
