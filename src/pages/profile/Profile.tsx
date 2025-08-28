import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  FitnessCenter as GymIcon,
  PersonOutline as TrainerIcon,
  Info as InfoIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService, clientService, ClientProfileData, UpdateClientProfileData, ProfileUpdateRequest } from '../../services';

const Profile: React.FC = () => {
  const { user: authUser, token, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'user' | 'client' | 'password' | null>(null);
  const [userFormData, setUserFormData] = useState<ProfileUpdateRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    height: undefined,
    heightUnit: 'cm'
  });
  const [clientFormData, setClientFormData] = useState<UpdateClientProfileData>({
    managementType: 'self',
    clientSource: 'direct'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch profile data
  const fetchProfile = async () => {
    if (!token || !authUser) return;

    try {
      setLoading(true);
      setError(null);

      // Use the general profile endpoint which returns nested client data
      const response = await authService.getProfile(token);
      
      if (response.success && response.data) {
        const userData = response.data;
        
        if (userData.userType === 'client' && userData.clientProfile) {
          // Create profile structure from API response
          const profileData: ClientProfileData = {
            id: userData.clientProfile.id,
            userId: userData.clientProfile.userId,
            managementType: userData.clientProfile.managementType,
            currentGymId: userData.clientProfile.currentGymId,
            currentTrainerId: userData.clientProfile.currentTrainerId,
            clientSource: userData.clientProfile.clientSource,
            independenceRequestedAt: userData.clientProfile.independenceRequestedAt,
            independenceGrantedAt: userData.clientProfile.independenceGrantedAt,
            created_at: userData.clientProfile.created_at,
            updated_at: userData.clientProfile.updated_at,
            user: {
              id: userData.id,
              email: userData.email,
              userType: userData.userType,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone || null,
              dateOfBirth: userData.dateOfBirth || null,
              gender: userData.gender || undefined,
              height: userData.height || undefined,
              heightUnit: userData.heightUnit || undefined,
              status: userData.status as 'active' | 'inactive',
              created_at: userData.created_at,
              updated_at: userData.updated_at
            },
            gym: null, // Will be populated if currentGymId exists
            trainer: null // Will be populated if currentTrainerId exists
          };
          
          setProfile(profileData);
          
          // Initialize form data
          setUserFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || 'prefer_not_to_say',
            height: userData.height || undefined,
            heightUnit: userData.heightUnit || 'cm'
          });
          
          setClientFormData({
            managementType: userData.clientProfile.managementType,
            clientSource: userData.clientProfile.clientSource
          });
        } else {
          // For non-client users, create basic profile structure
          const basicProfile: ClientProfileData = {
            id: 0,
            userId: userData.id,
            managementType: 'self',
            currentGymId: null,
            currentTrainerId: null,
            clientSource: 'direct',
            independenceRequestedAt: null,
            independenceGrantedAt: null,
            created_at: userData.created_at || new Date().toISOString(),
            updated_at: userData.updated_at || new Date().toISOString(),
            user: {
              id: userData.id,
              email: userData.email,
              userType: userData.userType as 'client',
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone || null,
              dateOfBirth: userData.dateOfBirth || null,
              gender: userData.gender || undefined,
              height: userData.height || undefined,
              heightUnit: userData.heightUnit || undefined,
              status: userData.status as 'active' | 'inactive',
              created_at: userData.created_at,
              updated_at: userData.updated_at
            },
            gym: null,
            trainer: null
          };
          
          setProfile(basicProfile);
          setUserFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || ''
          });
        }
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, [token, authUser]);

  // Handle user profile update
  const handleUserProfileUpdate = async () => {
    if (!token || !profile) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await clientService.updateUserProfile(token, userFormData);

      if (response.success && response.data) {
        // Update local profile data
        setProfile(prev => prev ? {
          ...prev,
          user: {
            ...prev.user,
            ...userFormData
          }
        } : null);

        // Update auth context
        if (updateProfile) {
          await updateProfile(response.data);
        }

        setSuccess('User profile updated successfully');
        setEditDialogOpen(false);
      } else {
        setError(response.message || 'Failed to update user profile');
      }
    } catch (err) {
      console.error('Failed to update user profile:', err);
      setError('Failed to update user profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle client profile update
  const handleClientProfileUpdate = async () => {
    if (!token || !profile) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await clientService.updateClientProfile(token, clientFormData);

      if (response.success && response.data) {
        // Update the profile with the new client data
        setProfile(prevProfile => {
          if (prevProfile && response.data && response.data.client) {
            return {
              ...prevProfile,
              managementType: response.data.client.managementType,
              clientSource: response.data.client.clientSource,
              updated_at: response.data.client.updated_at
            };
          }
          return prevProfile;
        });
        
        setSuccess('Client profile updated successfully');
        setEditDialogOpen(false);
      } else {
        setError(response.message || 'Failed to update client profile');
      }
    } catch (err) {
      console.error('Failed to update client profile:', err);
      setError('Failed to update client profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!token || passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await authService.changePassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setSuccess('Password changed successfully');
        setEditDialogOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (type: 'user' | 'client' | 'password') => {
    setEditType(type);
    setEditDialogOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Get management type color
  const getManagementTypeColor = (type: string) => {
    switch (type) {
      case 'self': return 'success';
      case 'gym': return 'primary';
      case 'trainer': return 'secondary';
      default: return 'default';
    }
  };

  // Get client source color - commented out as unused
  // const getClientSourceColor = (source: string) => {
  //   switch (source) {
  //     case 'direct': return 'success';
  //     case 'referral': return 'info';
  //     case 'online': return 'warning';
  //     case 'gym': return 'primary';
  //     default: return 'default';
  //   }
  // };

  if (loading || !authUser) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!profile || !profile.user) {
    if (error) {
      return (
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        </Container>
      );
    }
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>
          Loading profile information...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                mr: 3,
                fontSize: 32
              }}
            >
              {profile.user.firstName.charAt(0)}{profile.user.lastName.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {profile.user.firstName} {profile.user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {profile.user.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Role: ${profile.user.userType.charAt(0).toUpperCase() + profile.user.userType.slice(1)}`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={profile.user.status === 'active' ? 'Active' : 'Inactive'}
                  color={profile.user.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

          </Box>
        </Paper>

        {/* Basic Information */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => openEditDialog('user')}
            >
              Edit Profile
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  First Name
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.firstName}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Last Name
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.lastName}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.phone || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Date of Birth
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.dateOfBirth || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Gender
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.gender ? profile.user.gender.charAt(0).toUpperCase() + profile.user.gender.slice(1) : 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Height
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {profile.user.height ? `${profile.user.height} ${profile.user.heightUnit || 'cm'}` : 'Not provided'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Client-specific sections */}
        {authUser.userType === 'client' && (
          <>
            {/* Management Preferences */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GymIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Management Preferences</Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => openEditDialog('client')}
                >
                  Edit
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Management Type:
                  </Typography>
                  <Chip 
                    label={profile.managementType} 
                    color={getManagementTypeColor(profile.managementType)} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Client Source:
                  </Typography>
                  <Typography>{profile.clientSource}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Current Relationships */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrainerIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Current Relationships</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Gym:
                  </Typography>
                  {profile.gym ? (
                    <Chip label={profile.gym.name} color="primary" size="small" />
                  ) : (
                    <Typography variant="body2">No active gym</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Trainer:
                  </Typography>
                  {profile.trainer ? (
                    <Chip 
                      label={`${profile.trainer.user.firstName} ${profile.trainer.user.lastName}`} 
                      color="secondary" 
                      size="small" 
                    />
                  ) : (
                    <Typography variant="body2">No active trainer</Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Independence Status */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Independence Status</Typography>
              </Box>
              {profile.independenceGrantedAt ? (
                <Typography>
                  Independence Granted: {new Date(profile.independenceGrantedAt).toLocaleDateString()}
                </Typography>
              ) : profile.independenceRequestedAt ? (
                <Typography>
                  Independence Requested: {new Date(profile.independenceRequestedAt).toLocaleDateString()} (Pending)
                </Typography>
              ) : (
                <Typography>No independence requests</Typography>
              )}
            </Paper>
          </>
        )}

        {/* Security Section */}
        <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => openEditDialog('password')}
            >
              Change Password
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(profile.user.updated_at).toLocaleDateString()}
          </Typography>
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editType === 'user' ? 'Edit Basic Information' : 
             editType === 'client' ? 'Edit Management Preferences' : 
             'Change Password'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
            
            {editType === 'user' && (
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={userFormData.firstName}
                  onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={userFormData.lastName}
                  onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={userFormData.dateOfBirth}
                  onChange={(e) => setUserFormData({ ...userFormData, dateOfBirth: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    value={userFormData.gender}
                    onChange={(e) => setUserFormData({ ...userFormData, gender: e.target.value as 'male' | 'female' | 'other' | 'prefer_not_to_say' })}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Height"
                      name="height"
                      type="number"
                      inputProps={{ 
                        min: 0.01, 
                        max: 999.99, 
                        step: 0.01 
                      }}
                      value={userFormData.height || ''}
                      onChange={(e) => setUserFormData({ ...userFormData, height: e.target.value ? parseFloat(e.target.value) : undefined })}
                      helperText="Enter height value"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        label="Unit"
                        name="heightUnit"
                        value={userFormData.heightUnit}
                        onChange={(e) => setUserFormData({ ...userFormData, heightUnit: e.target.value as 'cm' | 'ft' })}
                      >
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="ft">ft</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {editType === 'client' && (
              <Box component="form" sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Management Type</InputLabel>
                  <Select
                    label="Management Type"
                    name="managementType"
                    value={clientFormData.managementType}
                    onChange={(e) => setClientFormData({ ...clientFormData, managementType: e.target.value as any })}
                  >
                    <MenuItem value="self">Self-Managed</MenuItem>
                    <MenuItem value="gym">Gym-Managed</MenuItem>
                    <MenuItem value="trainer">Trainer-Managed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Client Source</InputLabel>
                  <Select
                    label="Client Source"
                    name="clientSource"
                    value={clientFormData.clientSource}
                    onChange={(e) => setClientFormData({ ...clientFormData, clientSource: e.target.value as any })}
                  >
                    <MenuItem value="direct">Direct</MenuItem>
                    <MenuItem value="referral">Referral</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="gym">Gym</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {editType === 'password' && (
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={
                editType === 'user' ? handleUserProfileUpdate :
                editType === 'client' ? handleClientProfileUpdate :
                handlePasswordChange
              } 
              disabled={saving} 
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
