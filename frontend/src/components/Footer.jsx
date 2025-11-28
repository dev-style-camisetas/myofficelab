import React from 'react';
import { Box, Container, Typography, Link, Grid, TextField, Button, IconButton, Stack, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: '1px solid rgba(11,39,77,0.06)', py: { xs: 6, md: 10 }, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>myoffice lab</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Onde equipes tech transformam identidade em design e design em camisetas.</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton aria-label="facebook" href="#" size="small"><FacebookIcon fontSize="small" /></IconButton>
              <IconButton aria-label="instagram" href="#" size="small"><InstagramIcon fontSize="small" /></IconButton>
              <IconButton aria-label="twitter" href="#" size="small"><TwitterIcon fontSize="small" /></IconButton>
              <IconButton aria-label="linkedin" href="#" size="small"><LinkedInIcon fontSize="small" /></IconButton>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>© {new Date().getFullYear()} myoffice lab. Todos os direitos reservados.</Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Empresa</Typography>
            <Typography><Link href="#" color="inherit" underline="none">Sobre</Link></Typography>
            <Typography><Link href="#" color="inherit" underline="none">Trabalhe conosco</Link></Typography>
            <Typography><Link href="#" color="inherit" underline="none">Blog</Link></Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Ajuda</Typography>
            <Typography><Link href="#" color="inherit" underline="none">FAQ</Link></Typography>
            <Typography><Link href="#" color="inherit" underline="none">Suporte</Link></Typography>
            <Typography><Link href="#" color="inherit" underline="none">Política de troca</Link></Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Receba novidades</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Cadastre-se para receber novidades sobre promoções e lançamentos.</Typography>

            <Box component="form" onSubmit={(e)=> e.preventDefault()} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField placeholder="Seu email" size="small" sx={{ flex: 1 }} />
              <Button variant="contained" size="small">Assinar</Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="caption" color="text.secondary">Termos • Privacidade • Suporte</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">Feito com ♥ para camiseta personalizada</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
