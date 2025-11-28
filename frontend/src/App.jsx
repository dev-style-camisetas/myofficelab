import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box, Avatar, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Personalizar from './pages/Personalizar';
import Acompanhar from './pages/Acompanhar';
import Templates from './pages/Templates';
import ProdutosMaisPedidos from './pages/ProdutosMaisPedidos';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import { PedidoProvider } from './contexts/PedidoContext';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';
import Login from './pages/Login';
import { PrivateRoute } from './components/ProtectedRoute';

export default function App() {
  function HeaderBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

    const theme = useTheme();

    const initialsFromUser = (u) => {
      if (!u) return '';
      const name = (u.name || u.email || '').trim();
      if (!name) return '';
      const parts = name.split(/\s+/).filter(Boolean);
      let initials = '';
      if (parts.length === 1) {
        initials = parts[0].slice(0, 2);
      } else {
        initials = (parts[0][0] || '') + (parts[1][0] || '');
      }
      return initials.toUpperCase();
    };


    return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box
                component="img"
                src="/logo1.png"
                alt="myoffice lab"
                sx={{ height: 40, width: 'auto', display: { xs: 'none', sm: 'inline-block' }, mr: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: 'inline-block', sm: 'none' } }}>
                Loja
              </Typography>
            </Box>
          </Box>
          <Button color="inherit" component={Link} to="/">Início</Button>
          <Button color="inherit" component={Link} to="/personalizar">Personalizar</Button>
          <Button color="inherit" component={Link} to="/templates">Templates</Button>
          <Button color="inherit" component={Link} to="/mais-pedidos">Mais pedidos</Button>
          <Button color="inherit" component={Link} to="/acompanhar">Pedidos</Button>
          {isAuthenticated && (
            <>
              <Tooltip title={user?.name || user?.email} arrow>
                <IconButton
                  color="inherit"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    ml: 1,
                    transition: 'transform 180ms ease',
                    '&:hover': { transform: 'scale(1.06)' }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                      position: 'relative',
                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(250,250,252,0.94)' : theme.palette.background.paper,
                      color: theme.palette.primary.main,
                      boxShadow: `0 6px 14px rgba(2,6,23,0.10)`,
                      border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(16,24,40,0.04)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'transform 160ms ease, box-shadow 160ms ease',
                      '&:hover': { transform: 'translateY(-1px) scale(1.01)', boxShadow: `0 8px 22px rgba(2,6,23,0.12)` },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.secondary?.main || theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        zIndex: -1,
                        filter: 'blur(6px)',
                        opacity: 0.32,
                      }
                    }}
                  >
                    {initialsFromUser(user)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { minWidth: 220, p: 0 } }}
              >
                <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 18 }}>{initialsFromUser(user)}</Avatar>
                  <Box sx={{ ml: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{user?.name || user?.email}</Typography>
                    <Typography variant="caption" color="text.secondary">Conta</Typography>
                  </Box>
                </Box>
                <Divider />
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/acompanhar'); }}>
                  <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                  Meus pedidos
                </MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/templates'); }}>
                  <ListItemIcon><Inventory2Icon fontSize="small" /></ListItemIcon>
                  Meus templates
                </MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
                  <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                  Configurações
                </MenuItem>
                <Divider />
                <MenuItem sx={{ color: 'error.main' }} onClick={async () => {
                    setAnchorEl(null);
                    try {
                      await logout();
                    } finally {
                      navigate('/login');
                    }
                }}>
                  <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  }

  return (
  <AuthProvider>
  <PedidoProvider pollInterval={0}>
      <HeaderBar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/personalizar" element={<Personalizar />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/mais-pedidos" element={<ProdutosMaisPedidos />} />
              <Route path="/produtos/:id" element={<ProductDetails />} />
              <Route path="/acompanhar" element={<Acompanhar />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Container>
      </Box>
      <Footer />
    </PedidoProvider>
    </AuthProvider>
  );
}