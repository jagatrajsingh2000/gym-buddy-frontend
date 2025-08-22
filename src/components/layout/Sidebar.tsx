import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard,
  FitnessCenter,
  TrendingUp,
  Person,
  CalendarToday,
  Settings
} from '@mui/icons-material';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/workouts', label: 'Workouts', icon: <FitnessCenter /> },
  { path: '/progress', label: 'Progress', icon: <TrendingUp /> },
  { path: '/profile', label: 'Profile', icon: <Person /> },
  { path: '/schedule', label: 'Schedule', icon: <CalendarToday /> },
  { path: '/settings', label: 'Settings', icon: <Settings /> }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const handleItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
          Navigation
        </Typography>
      </Box>
      
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={currentPage === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: currentPage === item.path ? 'white' : 'inherit',
                  minWidth: 40 
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
