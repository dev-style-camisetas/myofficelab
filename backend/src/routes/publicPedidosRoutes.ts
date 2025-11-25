import { Router } from "express";
import {
  updateStatus,
} from "../controllers/pedidosController.ts";

const publicPedidosRouter = Router();

// Endpoint público para receber callbacks da bancada/simulador
publicPedidosRouter.patch("/pedidos/:id", updateStatus);
publicPedidosRouter.post("/pedidos/:id", updateStatus);

export default publicPedidosRouter;
