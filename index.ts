import dotenv from "dotenv";
dotenv.config();

// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import clienteRoutes from "./routes/cliente";
import enderecoRoutes from "./routes/enderecos";
import produtoRoutes from "./routes/produtos";
import authRoutes from "./routes/auth";
import categoriasRoutes from "./routes/categorias";
// import cartaoRoutes from './routes/cartao';
import pedidoRoutes from "./routes/pedidos";
// import pagamentoRoutes from './routes/pagamento';
// import promocaoRoutes from './routes/promocao';
// import avaliacaoRoutes from './routes/avaliacaoRoutes';
import { AppDataSource } from './database/appDataSource';
import path from "path";
import { verify, decode } from "jsonwebtoken";
import cors from "cors";

const app = express();
const JWT_SECRET = "meu-secret-muito-secreto";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não encontrado" });
  }
  // const validToken = verify(token, JWT_SECRET as string);
  // if (!validToken) {
  //     return res.status(401).json({ message: 'Token inválido' });
  // }
  req.body = req.body || {};
  const decoded = decode(token);
  req.body.idCliente = (decoded as { id: number }).id;
  next();
};

app.use(cors());

app.use(express.json());

async function startServer() {
  await AppDataSource.initialize();

  app.use("/clientes", clienteRoutes);
  app.use("/enderecos", verifyToken, enderecoRoutes);
  app.use("/pedidos", verifyToken, pedidoRoutes);
  app.use("/auth", authRoutes);
  app.use("/categorias", categoriasRoutes);
  app.use("/categorias", produtoRoutes);
  // app.use('/cartoes', cartaoRoutes);
  // app.use('/pagamentos', pagamentoRoutes);
  // app.use('/promocoes', promocaoRoutes);
  // app.use('/avaliacoes', avaliacaoRoutes);

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

  app.use(express.static(path.join(__dirname, "public")));
}

startServer().catch(console.error);
