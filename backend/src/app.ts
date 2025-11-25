import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/authRoutes.ts";
import userRouter from "./routes/userRoutes.ts";
import pedidosRouter from "./routes/pedidosRoutes.ts";
import produtosRouter from "./routes/produtoRoutes.ts";
import publicPedidosRouter from "./routes/publicPedidosRoutes.ts";
import { auth } from "./middleware/auth.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rotas públicas
app.use(authRouter);
app.use(publicPedidosRouter);

// Middleware de autenticação
app.use(auth);

// Rotas protegidas
app.use(userRouter);
app.use(produtosRouter);
app.use(pedidosRouter);

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

export default app;
