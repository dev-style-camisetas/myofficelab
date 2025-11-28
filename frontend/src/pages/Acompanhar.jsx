import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Typography, Grid, Box, Divider, Button, Chip, Stack, IconButton, Tooltip, Paper, CircularProgress, TextField, InputAdornment, Skeleton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatusPedido from '../components/StatusPedido';
import { usePedidos } from '../contexts/PedidoContext';
import { useNavigate } from 'react-router-dom';
import ReplayIcon from '@mui/icons-material/Replay';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

export default function Acompanhar() {
  const { pedidos, fetchPedidos, updateStatus } = usePedidos();

  useEffect(() => {
     fetchPedidos();
   }, []);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
   const [search, setSearch] = useState('');


  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchPedidos();
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'PENDENTE': return 'warning';
      case 'PEDIDO_RECEBIDO': return 'info';
      case 'EM_IMPRESSAO': return 'primary';
      case 'EM_COSTURA': return 'secondary';
      case 'FINALIZADO': return 'success';
      default: return 'default';
    }
  };

  const formatarNome = (texto) =>
    String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

   const buildImagePath = (produto) => {
    if (!produto) return '/basica_branca.png';
    const modeloMap = { 'Básico': 'basica', 'Polo': 'polo', 'Regata': 'regata' };
    const corMap = { 'Preto': 'Preta', 'Branco': 'Branca', 'Azul': 'Azul' };
    const modeloKey = Object.keys(modeloMap).find(k => k.toLowerCase() === String(produto.modelo || '').toLowerCase());
    const modeloValue = modeloKey ? modeloMap[modeloKey] : (produto.modelo || 'basica');
    const modeloFormatadoFinal = modeloMap[produto.modelo] || modeloValue;
    const corKey = Object.keys(corMap).find(k => k.toLowerCase() === String(produto.cor || '').toLowerCase());
    const corValue = corKey ? corMap[corKey] : (produto.cor || 'Branca');
    const corFormatada = formatarNome(corValue);
    return `/${modeloFormatadoFinal}_${corFormatada}.png`;
  };

  const [imageOpen, setImageOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');

  const openImage = (src, alt) => {
    setImageSrc(src || '/basica_branca.png');
    setImageAlt(alt || 'Camisa');
    setImageOpen(true);
  };
  const closeImage = () => setImageOpen(false);
  return (
    <>
      <Box>
      <Paper sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>Pedidos</Typography>
        <TextField
          size="small"
          placeholder="Buscar por id, modelo ou cor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ width: 320 }}
        />
        <Button startIcon={<ReplayIcon />} onClick={handleRefresh} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : 'Recarregar'}
        </Button>
      </Paper>

      <Grid container spacing={3}>
      {pedidos.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        if (String(p.id).includes(q)) return true;
        if (p.produtosEmPedidos?.some(it => (it.produto?.modelo || '').toLowerCase().includes(q) || (it.produto?.cor || '').toLowerCase().includes(q))) return true;
        return false;
      }).map((p) => {
        const primeiro = p.produtosEmPedidos?.[0]?.produto;
        const totalQuantidade = p.produtosEmPedidos?.reduce((s, it) => s + (it.quantidade || 0), 0) || 0;
        const imagem = buildImagePath(primeiro);
        return (
          <Grid item xs={12} md={6} key={p.id}>
            <Card sx={{ '&:hover': { boxShadow: 6 } }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{String(p.id).slice(-2)}</Avatar>}
                title={`Pedido #${p.id}`}
                subheader={new Date(p.createdAt).toLocaleString()}
                action={
                  <Tooltip title="Ver detalhes do primeiro produto">
                    <IconButton size="small" sx={{ mr: 1 }} onClick={() => {
                      const fp = p.produtosEmPedidos?.[0];
                      navigate(`/produtos/${fp?.produto?.id}`, { state: { fromPedido: true, quantidade: fp?.quantidade || 1, pedidoId: p.id } });
                    }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle2" mb={1}>Itens</Typography>
                    {p.produtosEmPedidos?.map((item) => (
                      <Box key={`${p.id}-${item.id_produto}`} sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1 }}>
                        <img src={buildImagePath(item.produto)} alt="thumb" style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 6, cursor: 'pointer' }} onError={(e)=> (e.target.src='/basica_branca.png')} onClick={() => openImage(buildImagePath(item.produto), `${item.produto?.modelo || 'Modelo'} ${item.produto?.cor || 'Cor'}`)} />
                        <div style={{ flex: 1 }}>
                          <Typography fontWeight={700}>{item.produto?.modelo || 'Modelo'} — {item.produto?.cor || 'Cor'}</Typography>
                          <Typography variant="caption">Tecido: {item.produto?.tecido || '-'}</Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip label={`Qtd: ${item.quantidade}`} size="small" />
                          </Box>
                        </div>
                      </Box>
                    ))}
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Total de itens: <strong>{p.produtosEmPedidos?.length || 0}</strong></Typography>
                      <Typography variant="body2">Quantidade total: <strong>{totalQuantidade}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                        <Tooltip title="Recarregar pedidos">
                          <IconButton size="small" onClick={() => handleRefresh()}>
                            <ReplayIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <Box sx={{ px: 2, pb: 2 }}>
                 <StatusPedido status={p.status} />
              </Box>
            </Card>
          </Grid>
        );
      })}
      {loading && [1,2,3].map(i => (
        <Grid item xs={12} md={6} key={`sk-${i}`}>
          <Card>
            <CardContent>
              <Skeleton variant="rectangular" height={80} />
            </CardContent>
          </Card>
        </Grid>
      ))}
      </Grid>
      {(!loading && pedidos.length === 0) && (
        <Paper sx={{ mt: 3, p: 3, textAlign: 'center' }} elevation={1}>
          <Typography variant="h6">Nenhum pedido encontrado</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Quando existirem pedidos, eles aparecerão aqui com o status atualizado pela bancada.</Typography>
          <Button variant="contained" onClick={handleRefresh} startIcon={<ReplayIcon />}>Recarregar</Button>
        </Paper>
      )}
    </Box>
      <Dialog open={imageOpen} onClose={closeImage} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 1 }}>
          {imageAlt}
          <IconButton
            aria-label="close"
            onClick={closeImage}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <img src={imageSrc} alt={imageAlt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }} onError={(e)=> (e.target.src='/basica_branca.png')} />
        </DialogContent>
      </Dialog>
    </>
  );
}