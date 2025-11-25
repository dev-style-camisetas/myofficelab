import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../config/axios';

const PedidoContext = createContext(null);

export function PedidoProvider({ children, pollInterval = 3000 }) {
  const [pedidos, setPedidos] = useState([]);
  const pollingRef = useRef(null);
  const failureCountRef = useRef(0);
  const backoffTimeoutRef = useRef(null);
  const pausedRef = useRef(false);

  const fetchPedidos = async (force = false) => {
    // if paused (backoff) and not forced, skip fetch
    if (pausedRef.current && !force) return;
    try {
      const { data } = await api.get('/pedidos');
      setPedidos(data);
      // reset failure/backoff on success
      failureCountRef.current = 0;
      if (backoffTimeoutRef.current) {
        clearTimeout(backoffTimeoutRef.current);
        backoffTimeoutRef.current = null;
      }
      pausedRef.current = false;
    } catch (err) {
      // count failures and apply a simple backoff so terminal isn't flooded
      failureCountRef.current = (failureCountRef.current || 0) + 1;
      if (failureCountRef.current <= 3) {
        console.error('Erro ao buscar pedidos:', err);
      } else {
        // after repeated failures, stop aggressive polling and schedule a retry
        console.error('Erros repetidos ao buscar pedidos. Fazendo backoff antes de tentar novamente.');
        // pause further fetches until backoff expires
        pausedRef.current = true;
        stopPolling();
        const backoffMs = Math.min(60000, Math.max(5000, pollInterval * 5 * failureCountRef.current));
        if (backoffTimeoutRef.current) clearTimeout(backoffTimeoutRef.current);
        backoffTimeoutRef.current = setTimeout(() => {
          // try a single forced fetch then resume polling if interval set
          fetchPedidos(true).then(() => {
            pausedRef.current = false;
            startPolling();
          });
        }, backoffMs);
      }
    }
  };

  const startPolling = () => {
    if (!pollInterval || pollInterval <= 0) return; // don't start if interval is 0 or falsy
    if (pollingRef.current) return;
    pollingRef.current = setInterval(fetchPedidos, pollInterval);
  };

  const stopPolling = () => {
    if (!pollingRef.current) return;
    clearInterval(pollingRef.current);
    pollingRef.current = null;
  };

  // update status on backend and locally
  const updateStatus = async (pedidoId, status) => {
    try {
      await api.patch(`/pedidos/${pedidoId}`, { status });
      setPedidos(prev => prev.map(p => (p.id === pedidoId ? { ...p, status } : p)));
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      return false;
    }
  };

  // handler to be used by callbacks (update without calling backend because callback already performed it)
  const handleCallbackUpdate = (pedidoId, status) => {
    setPedidos(prev => prev.map(p => (p.id === pedidoId ? { ...p, status } : p)));
  };

  useEffect(() => {
    // initial fetch and start polling
    fetchPedidos();
    startPolling();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    pedidos,
    setPedidos,
    fetchPedidos,
    startPolling,
    stopPolling,
    updateStatus,
    handleCallbackUpdate,
  };

  return <PedidoContext.Provider value={value}>{children}</PedidoContext.Provider>;
}

export const usePedidos = () => useContext(PedidoContext);