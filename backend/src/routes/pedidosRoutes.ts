import { Router } from "express";
import {
  createPedido,
  deletePedido,
  listPedidoById,
  listPedidos,
  updatePedido,
  updateStatus,
} from "../controllers/pedidosController.ts";

const pedidosRouter = Router();

pedidosRouter.post("/pedidos", createPedido);
pedidosRouter.get("/pedidos", listPedidos);
pedidosRouter.get("/pedidos/:id", listPedidoById);
pedidosRouter.put("/pedidos/:id", updatePedido);
pedidosRouter.delete("/pedidos/:id", deletePedido);
pedidosRouter.patch("/pedidos/:id", updateStatus);

export default pedidosRouter;
