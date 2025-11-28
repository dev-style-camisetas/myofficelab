import * as React from 'react';
import {
  Grid, Card, CardContent, Typography, TextField, MenuItem,
  Button, Snackbar, Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CamisetaPreview from '../components/CamisetaPreview';
import { usePedidos } from '../contexts/PedidoContext';
import api from '../config/axios';

 const modelos = ['Básico', 'Polo', 'Regata'];
const tecidos = ['Algodão', 'Dry Fit', 'Poliéster'];
const cores = ['Branco', 'Preto', 'Azul'];
const estampas = ['Logo minimalista', 'Frase personalizada', 'Desenho artístico'];
const tamanhos = ['P', 'M', 'G'];

 const modeloMap = { 'Básico': 0, 'Polo': 1, 'Regata': 2 };
const tecidoMap = { 'Algodão': 0, 'Dry Fit': 1, 'Poliéster': 2 };
const corMap = { 'Branco': 0, 'Preto': 1, 'Azul': 2 };
const estampaMap = { 'Logo minimalista': "0", 'Frase personalizada': "1", 'Desenho artístico': "2" };
const tamanhoMap = { 'P': 0, 'M': 1, 'G': 2 };

 const gerarBloco = (form) => ({
  cor: corMap[form.cor],
  lamina1: tecidoMap[form.tecido],
  lamina2: modeloMap[form.modelo],
  lamina3: tamanhoMap[form.tamanho],
  padrao1: estampaMap[form.estampa],
  padrao2: "0",
  padrao3: "0"
});

export default function Personalizar() {
  const [form, setForm] = React.useState({
    modelo: '', tecido: '', cor: '', estampa: '', tamanho: ''
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [editingId, setEditingId] = React.useState(null);

  const [snack, setSnack] = React.useState({
    open: false, message: '', severity: 'success'
  });

  const [loading, setLoading] = React.useState(false);

  const { setPedidos } = usePedidos();

  const onChange = (field) => (e) => setForm(v => ({ ...v, [field]: e.target.value }));

  const enviar = async () => {
    if (!(form.modelo && form.tecido && form.cor && form.estampa && form.tamanho)) return;

    setLoading(true);

    try {
      const bloco = gerarBloco(form);
      const payload = { ...form, bloco };

      if (editingId) {
         const updatePayload = { ...form };
        const { data } = await api.put(`/produtos/${editingId}`, updatePayload);
        setSnack({ open: true, message: `Template atualizado!`, severity: 'success' });
         navigate('/templates');
      } else {
        const { data } = await api.post('/produtos', payload);

        setPedidos(prev => [
          {
            dados: form,
            bloco,
            status: data.status,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);

        setSnack({ open: true, message: `Template cadastrado!`, severity: 'success' });
        setForm({ modelo: '', tecido: '', cor: '', estampa: '', tamanho: '' });
      }

    } catch (e) {
      setSnack({ open: true, message: 'Falha ao enviar pedido', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const disabled = !(form.modelo && form.tecido && form.cor && form.estampa && form.tamanho) || loading;

   React.useEffect(() => {
    if (location?.state?.produto) {
      const p = location.state.produto;
      setForm({ modelo: p.modelo || '', tecido: p.tecido || '', cor: p.cor || '', estampa: p.estampa || '', tamanho: p.tamanho || '' });
      setEditingId(p.id);
    }
  }, [location]);

  return (
    <Grid container spacing={3}>
       <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Personalização
            </Typography>

            <TextField select fullWidth label="Modelo"
              value={form.modelo} onChange={onChange('modelo')} sx={{ mb: 2 }}>
              {modelos.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            <TextField select fullWidth label="Tecido"
              value={form.tecido} onChange={onChange('tecido')} sx={{ mb: 2 }}>
              {tecidos.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            <TextField select fullWidth label="Cor"
              value={form.cor} onChange={onChange('cor')} sx={{ mb: 2 }}>
              {cores.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            <TextField select fullWidth label="Estampa"
              value={form.estampa} onChange={onChange('estampa')} sx={{ mb: 2 }}>
              {estampas.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            <TextField select fullWidth label="Tamanho"
              value={form.tamanho} onChange={onChange('tamanho')} sx={{ mb: 2 }}>
              {tamanhos.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button
                variant="contained"
                disabled={disabled}
                onClick={enviar}
                sx={{ fontWeight: 600 }}
              >
                {loading ? (editingId ? 'Salvando...' : 'Enviando...') : (editingId ? 'Salvar alterações' : 'Confirmar Template')}
              </Button>
              {editingId && (
                <Button variant="outlined" onClick={() => navigate('/templates')}>Cancelar</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>

       <Grid item xs={12} md={6}>
        <CamisetaPreview
          cor={form.cor || 'Branco'}
          modelo={form.modelo || 'Básico'}
          estampa={form.estampa || ''}
        />
      </Grid>

       <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
