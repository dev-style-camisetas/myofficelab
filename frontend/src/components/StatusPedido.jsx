import * as React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PrintIcon from '@mui/icons-material/Print';

const steps = [
  { key: 'PEDIDO_RECEBIDO', label: 'Recebido', icon: <HourglassTopIcon fontSize="small" /> },
  { key: 'EM_IMPRESSAO', label: 'Impressão', icon: <PrintIcon fontSize="small" /> },
  { key: 'EM_COSTURA', label: 'Costura', icon: <LocalLaundryServiceIcon fontSize="small" /> },
  { key: 'FINALIZADO', label: 'Finalizado', icon: <CheckIcon fontSize="small" /> },
];

export default function StatusPedido({ status = 'PEDIDO_RECEBIDO', compact = false }) {
  const theme = useTheme();
  const activeIndex = Math.max(steps.findIndex(s => s.key === status), 0);

  // subtle highlight when status changes
  const prev = React.useRef(status);
  const [flash, setFlash] = React.useState(false);
  React.useEffect(() => {
    if (prev.current !== status) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 900);
      prev.current = status;
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <Box sx={{ display: 'flex', flexDirection: compact ? 'column' : 'row', alignItems: 'flex-start', gap: 1, width: '100%' }}>
      <Typography variant="subtitle2" sx={{ minWidth: compact ? 'auto' : 100, fontSize: compact ? 13 : 14 }}>Status</Typography>

      {compact ? (
        <Box role="list" aria-label="Status do pedido" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {steps.map((s, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            // smaller sizes for compact vertical layout
            const circleSize = active ? 28 : 20;
            const circleBg = done ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.grey[100];
            const circleColor = done || active ? '#fff' : theme.palette.text.primary;

            return (
              <Box key={s.key} role="listitem" sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: circleSize,
                      height: circleSize,
                      borderRadius: '50%',
                      bgcolor: circleBg,
                      color: circleColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: active ? (flash ? '0 10px 28px rgba(0,0,0,0.14)' : '0 4px 14px rgba(0,0,0,0.10)') : 'none',
                      transform: active && flash ? 'scale(1.06)' : 'none',
                      transition: 'all 180ms ease'
                    }}
                    title={s.label}
                  >
                    {done ? <CheckIcon fontSize="small" /> : s.icon}
                  </Box>

                  {i < steps.length - 1 && (
                    <Box sx={{ width: 2, height: 28, borderRadius: 1, background: `linear-gradient(180deg, ${i < activeIndex ? theme.palette.primary.main : theme.palette.grey[300]} 0%, ${theme.palette.grey[200]} 100%)` }} aria-hidden />
                  )}
                </Box>

                <Box sx={{ mt: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: active ? 700 : 600, fontSize: 13 }}>{s.label}</Typography>
                  {active && <Typography variant="caption" color="text.secondary">Em andamento</Typography>}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', overflowX: 'auto', pr: 2 }} role="list" aria-label="Status do pedido">
          {steps.map((s, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;

            const circleSize = active ? 44 : 36;
            const circleBg = done ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.grey[100];
            const circleColor = done || active ? '#fff' : theme.palette.text.primary;

            return (
              <Box key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 86 }} role="listitem">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: circleSize,
                      height: circleSize,
                      borderRadius: '50%',
                      bgcolor: circleBg,
                      color: circleColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: active ? (flash ? '0 12px 36px rgba(0,0,0,0.18)' : '0 6px 20px rgba(0,0,0,0.12)') : 'none',
                      transform: active && flash ? 'scale(1.06)' : 'none',
                      transition: 'all 220ms ease'
                    }}
                    title={s.label}
                  >
                    {done ? <CheckIcon fontSize="small" /> : s.icon}
                  </Box>

                  <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center', maxWidth: 96 }}>{s.label}</Typography>
                </Box>

                    {i < steps.length - 1 && (
                      <Box sx={{ flex: 1, height: 3, display: 'flex', alignItems: 'center' }} aria-hidden>
                        <Box sx={{ width: '100%', height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${i < activeIndex ? theme.palette.primary.main : theme.palette.grey[300]} 0%, ${theme.palette.grey[200]} 100%)`, transition: 'background 180ms ease' }} />
                      </Box>
                    )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}