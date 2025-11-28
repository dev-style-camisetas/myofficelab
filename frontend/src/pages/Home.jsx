import * as React from 'react';
import { Container, Grid, Typography, Button, Card, CardContent, Box, Stack, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="lg">
       <Box sx={{ mt: 6, mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
              Camisetas feitas para devs, por devs.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Customize, salve o template e atualize o estilo da sua equipe. Processamento rápido e acompanhamento do pedido em tempo real.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" size="large" component={RouterLink} to="/personalizar">
                Personalizar agora
              </Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/templates">
                Ver templates
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', position: 'relative' }}>
                 <CarouselPreview />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

       <Box sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Editor Rápido</Typography>
                <Typography color="text.secondary">Monte sua camiseta como quem faz um pull request: simples, direto e sem bug.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Qualidade garantida</Typography>
                <Typography color="text.secondary">Estampa nítida, tecido top e um acabamento digno de sprint final.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Status em tempo real </Typography>
                <Typography color="text.secondary">Acompanhe o “deploy” da sua camiseta do início ao fim.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

function CarouselPreview() {
  const modelo = 'Básico';
  const cores = ['Branco', 'Preto', 'Azul'];

  const formatarNome = (texto) =>
    String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_\s-]/g, '')
      .replace(/\s+/g, '_');

  const modeloMap = { 'Básico': 'basica', 'Polo': 'polo', 'Regata': 'regata' };
  const modeloFormatado = modeloMap[modelo] || formatarNome(modelo);

  const imgs = cores.map(c => {
    const corMap = { 'Preto': 'Preta', 'Branco': 'Branca', 'Azul': 'Azul' };
    const corValue = corMap[c] || c;
    const corFormatada = formatarNome(corValue);
    return `/${modeloFormatado}_${corFormatada}.png`;
  });

  const [index, setIndex] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

   React.useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setPrefersReducedMotion(!!(mq && mq.matches));
    set();
    mq && mq.addEventListener && mq.addEventListener('change', set);
    return () => mq && mq.removeEventListener && mq.removeEventListener('change', set);
  }, []);

  React.useEffect(() => {
    if (hover || focus || prefersReducedMotion) return undefined;
    const id = setInterval(() => setIndex(i => (i + 1) % imgs.length), 3200);
    return () => clearInterval(id);
  }, [imgs.length, hover, focus, prefersReducedMotion]);

  const prev = () => setIndex(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIndex(i => (i + 1) % imgs.length);

   React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
   }, [imgs.length]);

   const touchRef = React.useRef({ x: 0 });
  const handleTouchStart = (e) => { touchRef.current.x = e.touches?.[0]?.clientX || 0; };
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX || 0;
    const dx = endX - touchRef.current.x;
    if (dx > 40) prev();
    if (dx < -40) next();
  };

  return (
    <Box
      component="section"
      aria-roledescription="carousel"
      sx={{ width: '100%', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
    >
       <Box sx={{ position: 'absolute', width: 360, height: 140, borderRadius: 4, filter: 'blur(28px)', zIndex: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(108,92,231,0.18), rgba(106,170,255,0.12))', transition: 'opacity 400ms ease', opacity: hover ? 1 : 0.85, '@keyframes gradientShift': { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } }, backgroundSize: '200% 200%', animation: prefersReducedMotion ? 'none' : 'gradientShift 10s linear infinite' }} />
       <IconButton onClick={prev} size="small" sx={{ position: 'absolute', left: 10, zIndex: 10, bgcolor: 'rgba(255,255,255,0.9)', boxShadow: 2, '&:hover': { bgcolor: 'white', transform: 'translateX(-2px)' }, transition: 'all 220ms ease' }} aria-label="anterior">
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Box sx={{ width: 240, height: 180, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 8, borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden', zIndex: 2 }}>
        {imgs.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Preview ${i}`}
            onError={(e) => (e.target.src = '/basica_branca.png')}
            loading="lazy"
            style={{
              position: 'absolute',
              width: '90%',
              height: '90%',
              objectFit: 'contain',
              transition: 'opacity 600ms ease, transform 600ms ease',
              opacity: i === index ? 1 : 0,
              transform: `scale(${i === index ? 1 : 0.97})`,
              borderRadius: 8,
              pointerEvents: i === index ? 'auto' : 'none'
            }}
          />
        ))}
      </Box>

      <IconButton onClick={next} size="small" sx={{ position: 'absolute', right: 10, zIndex: 10, bgcolor: 'rgba(255,255,255,0.9)', boxShadow: 2, '&:hover': { bgcolor: 'white', transform: 'translateX(2px)' }, transition: 'all 220ms ease' }} aria-label="próximo">
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

       <Box sx={{ position: 'absolute', left: 12, bottom: 22, zIndex: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>{cores[index]}</Typography>
      </Box>

       <Box sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5, zIndex: 3 }}>
        {imgs.map((_, i) => (
          <Box key={i}
            component="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir para ${i + 1}`}
            sx={{
              border: 'none',
              width: i === index ? 18 : 8,
              height: 6,
              bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
              borderRadius: 6,
              transition: 'all 280ms cubic-bezier(.2,.9,.2,1)',
              boxShadow: i === index ? '0 8px 26px rgba(16,24,40,0.14)' : 'none',
              cursor: 'pointer',
              p: 0
            }}
          />
        ))}
      </Box>
    </Box>
  );
}