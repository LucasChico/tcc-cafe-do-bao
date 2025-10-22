// src/entities/Cartao.ts
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cliente } from './cliente';

@Entity('cartao')
export class Cartao {
    @PrimaryColumn()
    nomeCartao!: number;

    @PrimaryColumn()
    idCliente!: number;

    @Column({ nullable: true })
    numeroCartao!: string;

    @Column({ nullable: true })
    dataVencimento!: Date;

    @Column({ nullable: true })
    cvv!: string;

    @ManyToOne(() => Cliente, cliente => cliente.cartoes)
    cliente!: Cliente;
}