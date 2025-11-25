import * as React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';

export default function ProductCard({ produto, onDelete, onEdit, selected = false, onToggleSelect, quantity = 1, onQuantityChange, onImageClick }) {
  if (!produto) return null;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const optionsOpen = Boolean(anchorEl);
  const handleOpenOptions = (e) => setAnchorEl(e.currentTarget);
  const handleCloseOptions = () => setAnchorEl(null);
  const handleEditFromMenu = () => {
    handleCloseOptions();
    onEdit && onEdit(produto);
  };
  const handleDeleteFromMenu = () => {
    handleCloseOptions();
    onDelete && onDelete(produto.id);
  };

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

  const modeloFormatado = modeloMap[produto.modelo] || formatarNome(produto.modelo || 'basica');
  // suportar keys com case diferente: buscar correspondência ignorando case
  const modeloKey = Object.keys(modeloMap).find(k => k.toLowerCase() === String(produto.modelo || '').toLowerCase());
  const modeloValue = modeloKey ? modeloMap[modeloKey] : produto.modelo || 'basica';

  const corKey = Object.keys(corMap).find(k => k.toLowerCase() === String(produto.cor || '').toLowerCase());
  const corValue = corKey ? corMap[corKey] : (produto.cor || 'Branca');

  const modeloFormatadoFinal = modeloMap[produto.modelo] || modeloValue;
  const corFormatada = formatarNome(corValue);
  const imagem = `/${modeloFormatadoFinal}_${corFormatada}.png`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* options button positioned absolute so it doesn't shift layout when quantity controls appear */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton size="small" onClick={handleOpenOptions} aria-controls={optionsOpen ? 'options-menu' : undefined} aria-haspopup="true" aria-expanded={optionsOpen ? 'true' : undefined}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="options-menu"
          anchorEl={anchorEl}
          open={optionsOpen}
          onClose={handleCloseOptions}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEditFromMenu}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDeleteFromMenu}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Excluir
          </MenuItem>
        </Menu>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img
            src={imagem}
            alt={`${produto.modelo} ${produto.cor}`}
            style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 8, cursor: onImageClick ? 'pointer' : 'default' }}
            onError={(e) => (e.target.src = '/basica_branca.png')}
            onClick={() => onImageClick && onImageClick(imagem, `${produto.modelo} ${produto.cor}`)}
          />
        </Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {produto.modelo || 'Modelo'} — {produto.cor || 'Cor'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tecido: {produto.tecido || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tamanho: {produto.tamanho || '-'}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Criado em: {new Date(produto.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', gap: 1, px: 2, alignItems: 'center', flexWrap: 'wrap' }}> 
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <Button
            size="small"
            variant={selected ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => onToggleSelect && onToggleSelect(produto.id)}
            sx={{ borderRadius: 2, textTransform: 'none', boxShadow: selected ? '0 6px 18px rgba(108,92,231,0.12)' : 'none' }}
          >
            {selected ? 'Remover' : 'Selecionar'}
          </Button>

          {selected && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton size="small" onClick={() => {
                const current = Number(quantity || 1);
                const next = Math.max(1, current - 1);
                onQuantityChange && onQuantityChange(produto.id, next);
              }} sx={{ border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'background.paper' }}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>{quantity}</Typography>
              <IconButton size="small" onClick={() => {
                const current = Number(quantity || 1);
                const next = current + 1;
                onQuantityChange && onQuantityChange(produto.id, next);
              }} sx={{ border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'background.paper' }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Button size="small" component={RouterLink} to={`/produtos/${produto.id}`} sx={{ textTransform: 'none', ml: 1 }}>
            Detalhes
          </Button>
        </Box>

        <Box sx={{ width: 48 }} />
      </CardActions>
    </Card>
  );
}
