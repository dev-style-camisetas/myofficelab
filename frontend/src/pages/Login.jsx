import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Link as MuiLink,
  Alert,
  useTheme,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const { login, register, isAuthenticated, loading } = useAuth();
  const theme = useTheme();
  // using inline errors/alerts; toast provider (MUI Snackbar) still available as useToast if needed

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setSubmitting(true);
    // client-side validation
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
    setEmailError(validEmail ? '' : 'Informe um email válido');
    setPasswordError(validPassword ? '' : 'Senha deve ter ao menos 6 caracteres');

    if (!validEmail || !validPassword) {
      setSubmitting(false);
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err?.message || 'Email ou senha incorretos.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError('');
    // client-side validation
    const validName = validateName(name);
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
    const passwordsMatch = password === confirmPassword;

    setNameError(validName ? '' : 'Informe seu nome (mín. 2 caracteres)');
    setEmailError(validEmail ? '' : 'Informe um email válido');
    setPasswordError(validPassword ? '' : 'Senha deve ter ao menos 6 caracteres');
    setConfirmError(passwordsMatch ? '' : 'As senhas não coincidem');

    if (!validName || !validEmail || !validPassword || !passwordsMatch) {
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim().toLowerCase(), password, name.trim());
    } catch (err) {
      const msg = err?.message || 'Erro ao registrar.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Validation helpers
  function validateEmail(v) {
    if (!v) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(v).toLowerCase().trim());
  }

  function validatePassword(v) {
    if (!v) return false;
    return v.length >= 6;
  }

  function validateName(v) {
    if (!v) return false;
    return v.trim().length >= 2;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', bgcolor: theme.palette.background.default, pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 8 } }}>
  <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.16)', mb: 2 }}>
                <LockOutlinedIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Bem-vindo à Loja
              </Typography>
              <Typography sx={{ opacity: 0.92, textAlign: 'center' }}>
                Crie camisetas personalizadas e acompanhe seus pedidos com facilidade.
              </Typography>
            </Grid>

            <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={isRegister ? handleRegister : handleLogin} noValidate>
                {isRegister && (
                  <TextField
                    label="Nome"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
                    fullWidth
                    margin="dense"
                    required
                    error={Boolean(nameError)}
                    helperText={nameError}
                  />
                )}

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                  fullWidth
                  margin="dense"
                  required
                  error={Boolean(emailError)}
                  helperText={emailError}
                />

                <TextField
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                  fullWidth
                  margin="dense"
                  required
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                />

                {isRegister && (
                  <TextField
                    label="Confirmar senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) setConfirmError(''); }}
                    fullWidth
                    margin="dense"
                    required
                    error={Boolean(confirmError)}
                    helperText={confirmError}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3, py: 1.25, fontWeight: 700 }}
                  disabled={submitting}
                >
                  {submitting ? (isRegister ? 'Cadastrando...' : 'Entrando...') : isRegister ? 'Cadastrar' : 'Entrar'}
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  {isRegister ? (
                    <Typography variant="body2">
                      Já tem conta?{' '}
                      <MuiLink component="button" onClick={() => { setIsRegister(false); setError(''); setNameError(''); setEmailError(''); setPasswordError(''); setConfirmError(''); }}>
                        Entrar
                      </MuiLink>
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      Não tem conta?{' '}
                      <MuiLink component="button" onClick={() => { setIsRegister(true); setError(''); setNameError(''); setEmailError(''); setPasswordError(''); setConfirmError(''); }}>
                        Cadastre-se
                      </MuiLink>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
