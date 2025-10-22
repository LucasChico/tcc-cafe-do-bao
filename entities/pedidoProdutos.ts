// src/entities/Pedido_Produtos.ts
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Pedido } from './pedido';
import { Produtos } from './produtos';

@Entity('pedido_produto')
export class PedidoProduto {
  @PrimaryColumn()
  idPedido!: number;

  @PrimaryColumn()
  idProduto!: number;

  @Column()
  quantidade!: number;

  @ManyToOne(() => Pedido, pedido => pedido.pedido_produtos)
  pedido!: Pedido;

  @ManyToOne(() => Produtos, produto => produto.pedido_produtos)
  produto!: Produtos;
}