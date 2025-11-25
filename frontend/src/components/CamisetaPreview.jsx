import * as React from 'react';
import { Card, CardContent, Typography, Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CamisetaPreview({ cor = 'Branco', modelo = 'Básico' }) {
  const formatarNome = (texto) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

  const modeloMap = {
    'Básico': 'basica',
    'Polo': 'polo',
    'Regata': 'regata',
  };

  const corMap = {
    'Preto': 'Preta',
    'Branco': 'Branca',
    'Azul': 'Azul',
  };

  const modeloFormatado = modeloMap[modelo] || formatarNome(modelo);
  const corFormatada = formatarNome(corMap[cor] || cor);
  const imagem = `/${modeloFormatado}_${corFormatada}.png`;

  // debug log removed to avoid noisy console output during renders

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ height: '100%', textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Prévia
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
            <img
              src={imagem}
              alt={`${modelo} ${cor}`}
              style={{ width: 230, height: 230, objectFit: 'contain', borderRadius: 12, cursor: 'pointer' }}
              onError={(e) => (e.target.src = '/basica_branca.png')}
              onClick={handleOpen}
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Modelo: {modelo} — Cor: {cor}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 1 }}>
          Foto da Camisa
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <img
            src={imagem}
            alt={`${modelo} ${cor}`}
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }}
            onError={(e) => (e.target.src = '/basica_branca.png')}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
