import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box 
} from '@mui/material';
import { FitnessCenter, AccountCircle } from '@mui/icons-material';
import { User } from '../../services/authService';

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
    <AppBar position="static">
      <Toolbar>
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
