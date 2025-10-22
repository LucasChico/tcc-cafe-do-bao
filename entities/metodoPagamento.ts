// src/entities/MetodoPagamento.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Pedido } from './pedido';

@Entity('metodo_pagamento')
export class MetodoPagamento {
    @PrimaryGeneratedColumn()
    idPagamento!: number;

    @Column()
    tipo!: string;

    @Column('float')
    valor!: number;

    @Column()
    idPedido!: number;

    @Column({ nullable: true })
    qrCode!: string;

    @OneToOne(() => Pedido, pedido => pedido.metodo_pagamento)
    pedido!: Pedido;
}