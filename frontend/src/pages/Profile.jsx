import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const openEditor = () => {
    setError('');
    setSuccess('');
    setName(user?.name || '');
    setPassword('');
    setConfirm('');
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    if (!name || name.trim().length < 2) return setError('Nome deve ter ao menos 2 caracteres');
    if (password && password.length < 6) return setError('Senha deve ter ao menos 6 caracteres');
    if (password && password !== confirm) return setError('As senhas não coincidem');

    setLoading(true);
    try {
      const payload = { name: name.trim() };
      if (password) payload['password'] = password;
      await updateProfile(payload);
      setSuccess('Perfil atualizado com sucesso');
      setOpen(false);
    } catch (e) {
      setError(e?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 900 }} elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>
              {user?.name ? user.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : (user?.email || '').slice(0,2).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.name || 'Usuário'}</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>{user?.email}</Typography>

            <Box>
              <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={openEditor} startIcon={<EditIcon />}>Editar</Button>
              <Button variant="outlined" color="inherit" onClick={logout}>Sair</Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>Informações da conta</Typography>
            <Typography variant="body1"><strong>Nome:</strong> {user?.name || '-'}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Email:</strong> {user?.email || '-'}</Typography>

            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Grid>
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogContent>
            <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <TextField label="Nova senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
            <TextField label="Confirmar nova senha" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth margin="normal" />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
