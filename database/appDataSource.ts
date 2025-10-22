import { DataSource } from "typeorm";
import { Cliente } from "../entities/cliente";
import { Endereco } from "../entities/endereco";
import { Produtos } from "../entities/produtos";
import { Pedido } from "../entities/pedido";
import { PedidoProduto } from "../entities/pedidoProdutos";
import { MetodoPagamento } from "../entities/metodoPagamento";
import { Cartao } from "../entities/cartao";
import { Promocao } from "../entities/promocao";
import { Avaliacao } from "../entities/avaliacao";
import { Categorias } from "../entities/categorias";

const { HOST, USERNAME, PASSWORD, DATABASE } = process.env;
console.log(HOST, USERNAME, PASSWORD, DATABASE);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: HOST,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  ssl: true,
  entities: [
    Cliente,
    Categorias,
    Endereco,
    Produtos,
    Pedido,
    PedidoProduto,
    MetodoPagamento,
    Cartao,
    Promocao,
    Avaliacao,
  ],
  synchronize: true,
  logging: true,
});
