import * as React from 'react';
import { Grid, Typography, CircularProgress, Alert, Button, Box, Drawer, List, ListItem, ListItemText, IconButton, Divider, Badge, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductCard from '../components/ProductCard';
import api from '../config/axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const [produtos, setProdutos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selected, setSelected] = React.useState({});
  const [cartOpen, setCartOpen] = React.useState(false);

  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading, user } = useAuth();

   const formatarNome = (texto) =>
    String(texto || '')
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

  const getImagePath = (produto) => {
    const modeloKey = Object.keys(modeloMap).find(k => k.toLowerCase() === String(produto.modelo || '').toLowerCase());
    const modeloValue = modeloKey ? modeloMap[modeloKey] : produto.modelo || 'basica';

    const corKey = Object.keys(corMap).find(k => k.toLowerCase() === String(produto.cor || '').toLowerCase());
    const corValue = corKey ? corMap[corKey] : (produto.cor || 'Branca');

    const modeloFormatadoFinal = modeloMap[produto.modelo] || modeloValue;
    const corFormatada = formatarNome(corValue);
    return `/${modeloFormatadoFinal}_${corFormatada}.png`;
  };

  const [imageOpen, setImageOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');

  const openImage = (src, alt) => {
    setImageSrc(src);
    setImageAlt(alt);
    setImageOpen(true);
  };
  const closeImage = () => setImageOpen(false);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/produtos');
         const filtered = Array.isArray(data) && user ? data.filter(p => Number(p.userId) === Number(user.id)) : [];
        setProdutos(filtered);
      } catch (e) {
        setError('Falha ao carregar templates');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) fetch();
    if (!authLoading && !isAuthenticated) setLoading(false);
  }, [isAuthenticated, authLoading]);

  if (authLoading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Templates cadastrados</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && produtos.length === 0 && (
        <Alert severity="info">Nenhum template seu cadastrado ainda.</Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Badge badgeContent={Object.keys(selected).length} color="primary"><ShoppingCartIcon /></Badge>}
          onClick={() => setCartOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
        >
          Ver carrinho ({Object.keys(selected).length})
        </Button>

        <Button
          variant="contained"
          disabled={Object.keys(selected).length === 0}
          onClick={async () => {
             try {
              const produtosPayload = Object.entries(selected).map(([id, qty]) => ({ id: Number(id), quantidade: Number(qty) }));
              await api.post('/pedidos', { produtos: produtosPayload, status: 'PEDIDO_RECEBIDO' });
              setSelected({});
              setProdutos(prev => prev);
              alert('Pedido enviado com sucesso para a bancada!');
            } catch (e) {
              console.error(e);
              const msg = e?.response?.data?.message || e?.message || 'Erro ao enviar pedido';
              setError(msg);
              setTimeout(() => setError(null), 6000);
            }
          }}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2, boxShadow: Object.keys(selected).length ? '0 8px 28px rgba(108,92,231,0.14)' : 'none' }}
        >
          Enviar pedido ({Object.keys(selected).length})
        </Button>
      </Box>

       <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 360, p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Carrinho</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {Object.keys(selected).length === 0 && (
              <ListItem>
                <ListItemText primary="Seu carrinho está vazio" secondary="Adicione templates clicando em Selecionar" />
              </ListItem>
            )}
            {Object.entries(selected).map(([id, qty]) => {
              const produto = produtos.find(p => p.id === Number(id));
              if (!produto) return null;
              const imagem = getImagePath(produto);
              return (
                <ListItem key={id} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                    <img src={imagem} alt={`${produto.modelo} ${produto.cor}`} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, cursor: 'pointer' }} onError={(e)=> { e.target.src = '/basica_branca.png'; }} onClick={() => openImage(imagem, `${produto.modelo} ${produto.cor}`)} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{produto.modelo} — {produto.cor}</Typography>
                      <Typography variant="body2" color="text.secondary">Tecido: {produto.tecido || '-' } • Tamanho: {produto.tamanho || '-'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => {
                          const current = Number(selected[id] || 1);
                          const next = Math.max(1, current - 1);
                          setSelected(s => ({ ...s, [id]: next }));
                        }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{qty}</Typography>
                        <IconButton size="small" onClick={() => {
                          const current = Number(selected[id] || 1);
                          const next = current + 1;
                          setSelected(s => ({ ...s, [id]: next }));
                        }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton color="error" size="small" onClick={() => {
                        setSelected(s => {
                          const copy = { ...s };
                          delete copy[id];
                          return copy;
                        });
                      }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">Total de itens</Typography>
            <Typography variant="body1"><strong>{Object.values(selected).reduce((s, v) => s + Number(v || 0), 0)}</strong></Typography>
          </Box>
          <Button variant="contained" fullWidth disabled={Object.keys(selected).length === 0} onClick={async () => {
            try {
              const produtosPayload = Object.entries(selected).map(([id, qty]) => ({ id: Number(id), quantidade: Number(qty) }));
              await api.post('/pedidos', { produtos: produtosPayload, status: 'PEDIDO_RECEBIDO' });
              setSelected({});
              setProdutos(prev => prev);
              setCartOpen(false);
              alert('Pedido enviado com sucesso!');
            } catch (e) {
              console.error(e);
              const msg = e?.response?.data?.message || e?.message || 'Erro ao enviar pedido';
              setError(msg);
              setTimeout(() => setError(null), 6000);
            }
          }} sx={{ borderRadius: 2, textTransform: 'none', py: 1.5, boxShadow: '0 10px 30px rgba(108,92,231,0.14)' }}>Confirmar pedido</Button>
        </Box>
      </Drawer>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {produtos.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProductCard
              produto={p}
              selected={Boolean(selected[p.id])}
              quantity={selected[p.id] || 1}
              onQuantityChange={(id, qty) => setSelected(s => ({ ...s, [id]: qty }))}
              onToggleSelect={(id) => {
                setSelected(s => {
                  const exists = Boolean(s[id]);
                  if (exists) {
                    const copy = { ...s };
                    delete copy[id];
                    return copy;
                  }
                  return { ...s, [id]: 1 };
                });
              }}
              onEdit={(produto) => navigate('/personalizar', { state: { produto } })}
              onDelete={async (id) => {
                if (!confirm('Deseja realmente excluir esse template?')) return;
                try {
                  await api.delete(`/produtos/${id}`);
                  setProdutos(prev => prev.filter(x => x.id !== id));
                } catch (e) {
                  console.error(e);
                  alert('Você não pode excluir esse template pois ele está vinculado a um pedido.');
                }
              }}
              onImageClick={(src, alt) => openImage(src, alt)}
            />
          </Grid>
        ))}
      </Grid>
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
          <img src={imageSrc} alt={imageAlt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }} onError={(e)=> { e.target.src = '/basica_branca.png'; }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
