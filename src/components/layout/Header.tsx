import React from 'react';
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
  useMediaQuery
} from '@mui/material';
import { FitnessCenter, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <AppBar position="fixed" sx={{ zIndex: 1300 }}>
      <Toolbar>
        {isMobile && onMobileMenuToggle && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMobileMenuToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <FitnessCenter sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🏋️‍♂️ Gym Buddy
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {getUserDisplayName(user)}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Typography variant="body2">
            Welcome to Gym Buddy!
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
