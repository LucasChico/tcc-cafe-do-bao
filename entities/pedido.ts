// src/entities/Pedido.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Cliente } from './cliente';
import { PedidoProduto } from './pedidoProdutos';
import { MetodoPagamento } from './metodoPagamento';
import { Avaliacao } from './avaliacao';

@Entity('pedido')
export class Pedido {
    @PrimaryGeneratedColumn()
    idPedido!: number;

    @Column()
    idCliente!: number;

    @Column({ nullable: true })
    status!: 'aberto' | 'checkout' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';

    @Column()
    dataPedido!: Date;

    @Column({ nullable: true })
    idEndereco!: number;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    cliente!: Cliente;

    @Column({ nullable: true })
    valorTotal!: number;

    @Column({ nullable: true })
    valorPago!: number;

    @Column({ nullable: true })
    dataPagamento!: Date;

    @Column({ nullable: true })
    idMetodoPagamento!: number;
    

    @OneToMany(() => PedidoProduto, pedidoProdutos => pedidoProdutos.pedido)
    pedido_produtos!: PedidoProduto[];

    @OneToOne(() => MetodoPagamento, metodoPagamento => metodoPagamento.pedido)
    metodo_pagamento!: MetodoPagamento;

    @OneToOne(() => Avaliacao, avaliacao => avaliacao.pedido)
    avaliacao!: Avaliacao;
}       