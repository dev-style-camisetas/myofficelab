import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Button, Alert, Box } from '@mui/material';
import api from '../config/axios';
import CamisetaPreview from '../components/CamisetaPreview';

export default function ProductDetails(){
  const { id } = useParams();
  const [produto, setProduto] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(()=>{
    const fetch = async ()=>{
      setLoading(true);
      try{
        const { data } = await api.get(`/produtos/${id}`);
        setProduto(data);
      }catch(e){
        setError('Erro ao carregar produto');
      }finally{
        setLoading(false);
      }
    };
    fetch();
  },[id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!produto) return <Alert severity="info">Produto não encontrado</Alert>;

  const location = useLocation();
  const fromPedido = location?.state?.fromPedido || false;
  const quantidade = location?.state?.quantidade;

  return (
    <Card>
      <CardContent>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>Voltar</Button>
        <Typography variant="h5" fontWeight={700} gutterBottom>Detalhes do Template</Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <CamisetaPreview modelo={produto.modelo || 'Básico'} cor={produto.cor || 'Branco'} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{produto.modelo} — {produto.cor}</Typography>
            <Typography>Tecido: {produto.tecido}</Typography>
            <Typography>Estampa: {produto.estampa}</Typography>
            <Typography>Tamanho: {produto.tamanho}</Typography>
            {fromPedido && (
              <Typography sx={{ mt: 1 }}><strong>Quantidade neste pedido:</strong> {quantidade ?? '—'}</Typography>
            )}
            <Typography sx={{ mt: 1 }} variant="caption">Criado em: {new Date(produto.createdAt).toLocaleString()}</Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {!fromPedido && (
                <>
                  <Button variant="contained" onClick={() => navigate('/personalizar', { state: { produto } })}>Editar</Button>
                  <Button variant="outlined" color="error" onClick={async ()=>{
                    if(!confirm('Deseja realmente excluir esse template?')) return;
                    try{
                      await api.delete(`/produtos/${id}`);
                      navigate('/templates');
                    }catch(e){
                      alert('Erro ao excluir');
                    }
                  }}>Excluir</Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
