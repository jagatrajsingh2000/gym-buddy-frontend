import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import {
  Dashboard,
  FitnessCenter,
  TrendingUp,
  Person,
  CalendarToday,
  Settings,
  Chat as ChatIcon,
  Restaurant
} from '@mui/icons-material';

interface SidebarProps {
  currentPage?: string;
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, mobileOpen, onMobileToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = currentPage || location.pathname;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/workouts', label: 'Workouts', icon: <FitnessCenter /> },
    { path: '/progress', label: 'Progress', icon: <TrendingUp /> },
    { path: '/profile', label: 'Profile', icon: <Person /> },
    { path: '/schedule', label: 'Schedule', icon: <CalendarToday /> },
    { path: '/chat', label: 'AI Chat', icon: <ChatIcon /> },
    ...(user?.userType === 'client' ? [{ path: '/diet', label: 'My Diet', icon: <Restaurant /> }] : []),
    ...(user?.userType === 'trainer' ? [{ path: '/diet', label: 'Diet Plans', icon: <Restaurant /> }] : []),
    { path: '/settings', label: 'Settings', icon: <Settings /> }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    }
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onMobileToggle}
      sx={{
        width: { xs: 0, md: 240 },
        flexShrink: 0,
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: { xs: 280, md: 240 },
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
          display: { xs: 'block', md: 'block' },
          position: isMobile ? 'fixed' : 'fixed',
          height: '100vh',
          top: 0,
          left: 0
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
              selected={activePage === item.path}
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
                  color: activePage === item.path ? 'white' : 'inherit',
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
