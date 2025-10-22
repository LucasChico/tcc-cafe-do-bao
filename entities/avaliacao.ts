// src/entities/Avaliacao.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Pedido } from './pedido';

@Entity('avaliacao')
export class Avaliacao {
    @PrimaryGeneratedColumn()
    idAvaliacao!: number;

    @Column()
    idPedido!: number;

    @Column({ nullable: true })
    nota!: number;

    @Column({ nullable: true })
    comentario!: string;

    @Column()
    dataAvaliacao!: Date;

    @OneToOne(() => Pedido, pedido => pedido.avaliacao)
    pedido!: Pedido;
}