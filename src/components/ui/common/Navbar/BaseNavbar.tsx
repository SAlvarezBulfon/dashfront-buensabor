import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Divider from '@mui/material/Divider';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function PrimarySearchAppBar() {
  const {logout } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement | null | any);
  };
  
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({logoutParams: { returnTo: window.location.origin }});
    handleMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}><div><Person2OutlinedIcon sx={{mr: 1}}/></div>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}><div><SettingsOutlinedIcon sx={{mr: 1}} /></div>Ajustes</MenuItem>
      <Divider/>
      <MenuItem onClick={handleLogout}><div><LoginOutlinedIcon sx={{mr: 1}} /></div>Cerrar Sesión</MenuItem>
    </Menu>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor: '#fb6376'}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ justifyContent: 'center' }}
          >
           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Administrador</Link>

          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}