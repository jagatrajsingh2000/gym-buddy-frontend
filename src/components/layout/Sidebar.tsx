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
  useMediaQuery,
  Divider
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
  Restaurant,
  Home
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
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard />, category: 'main' },
    { path: '/workouts', label: 'Workouts', icon: <FitnessCenter />, category: 'fitness' },
    { path: '/progress', label: 'Progress', icon: <TrendingUp />, category: 'fitness' },
    { path: '/body-metrics', label: 'Body Metrics', icon: <FitnessCenter />, category: 'fitness' },
    { path: '/profile', label: 'Profile', icon: <Person />, category: 'account' },
    { path: '/schedule', label: 'Schedule', icon: <CalendarToday />, category: 'planning' },
    { path: '/chat', label: 'AI Chat', icon: <ChatIcon />, category: 'support' },
    ...(user?.userType === 'client' ? [{ path: '/diet', label: 'My Diet', icon: <Restaurant />, category: 'fitness' }] : []),
    ...(user?.userType === 'trainer' ? [{ path: '/diet', label: 'Diet Plans', icon: <Restaurant />, category: 'fitness' }] : []),
    { path: '/settings', label: 'Settings', icon: <Settings />, category: 'account' }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'main': return '#1a1a2e';
      case 'fitness': return '#e94560';
      case 'planning': return '#00d4aa';
      case 'support': return '#3742fa';
      case 'account': return '#ff9f43';
      default: return '#6c757d';
    }
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onMobileToggle}
      sx={{
        width: { xs: 0, md: 280 },
        flexShrink: 0,
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: { xs: 320, md: 280 },
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          display: { xs: 'block', md: 'block' },
          position: isMobile ? 'fixed' : 'fixed',
          height: '100vh',
          top: 0,
          left: 0,
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          overflowX: 'hidden'
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(233, 69, 96, 0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(0, 212, 170, 0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            boxShadow: '0px 4px 20px rgba(233, 69, 96, 0.3)'
          }}>
            <Home sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NAVIGATION
          </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ 
          opacity: 0.8,
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Explore Your Fitness World
        </Typography>
      </Box>
      
      {/* Menu Items */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
          borderRadius: '3px'
        }
      }}>
        <List sx={{ pt: 2, pb: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activePage === item.path}
                onClick={() => handleItemClick(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${getCategoryColor(item.category)} 0%, ${getCategoryColor(item.category)}dd 100%)`,
                    color: 'white',
                    boxShadow: `0px 8px 25px ${getCategoryColor(item.category)}40`,
                    transform: 'translateX(8px)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${getCategoryColor(item.category)} 0%, ${getCategoryColor(item.category)}dd 100%)`,
                      transform: 'translateX(8px) scale(1.02)'
                    }
                  },
                  '&:hover': {
                    background: `linear-gradient(135deg, ${getCategoryColor(item.category)}15 0%, ${getCategoryColor(item.category)}25 100%)`,
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: getCategoryColor(item.category)
                    }
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: activePage === item.path ? 'white' : getCategoryColor(item.category),
                    minWidth: 44,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: activePage === item.path ? 700 : 600,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Footer Section */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ 
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontWeight: 500,
          opacity: 0.8
        }}>
          💪 Powered by Gym Buddy
        </Typography>
        <Typography variant="caption" sx={{ 
          display: 'block',
          color: 'text.secondary',
          fontSize: '0.7rem',
          mt: 0.5,
          opacity: 0.6
        }}>
          Transform • Track • Triumph
        </Typography>
      </Box>
    </Drawer>
  );
};
