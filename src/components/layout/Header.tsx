import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { FitnessCenter, AccountCircle, Menu as MenuIcon, Notifications, Settings } from '@mui/icons-material';
import { User } from '../../services/authService';

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onMobileMenuToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    handleClose();
  };

  const getUserDisplayName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserRole = (user: User) => {
    return user.userType || 'Member';
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1300,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: '70px' }}>
        {isMobile && onMobileMenuToggle && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMobileMenuToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
            borderRadius: '50%',
            p: 1,
            mr: 2,
            boxShadow: '0px 4px 20px rgba(233, 69, 96, 0.3)'
          }}>
            <FitnessCenter sx={{ 
              fontSize: 28, 
              color: 'white',
              filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))'
            }} />
          </Box>
          
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              GYM BUDDY
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Transform Your Fitness Journey
            </Typography>
          </Box>
        </Box>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User Role Badge */}
            <Chip
              label={getUserRole(user)}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: '22px',
                '& .MuiChip-label': {
                  px: 1.2
                }
              }}
            />
            
            {/* Notifications */}
            <IconButton
              size="small"
              color="inherit"
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Notifications sx={{ fontSize: '1.2rem' }} />
            </IconButton>
            
            {/* User Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '0.85rem',
                  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                {getUserDisplayName(user)}
              </Typography>
              <IconButton
                size="small"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  p: 0.4,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Avatar sx={{ 
                  width: 30, 
                  height: 30,
                  background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0px 2px 8px rgba(233, 69, 96, 0.3)',
                  fontSize: '0.9rem'
                }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  minWidth: 200
                }
              }}
            >
              <MenuItem 
                onClick={handleProfileClick}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(233, 69, 96, 0.05)',
                    color: '#e94560'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
                Profile
              </MenuItem>
              <MenuItem 
                onClick={handleSettingsClick}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 212, 170, 0.05)',
                    color: '#00d4aa'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Settings sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 71, 87, 0.05)',
                    color: '#ff4757'
                  },
                  transition: 'all 0.2s ease-in-out',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  mt: 0.5
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'white',
                textAlign: 'center'
              }}
            >
              Welcome to Gym Buddy! 💪
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
