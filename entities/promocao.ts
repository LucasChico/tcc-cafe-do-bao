// src/entities/Promocao.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Produtos } from './produtos';

@Entity('promocao')
export class Promocao {
    @PrimaryGeneratedColumn()
    idPromocao!: number;

    @Column()
    descricao!: string;

    @Column('float')
    valorDesconto!: number;

    @Column()
    dataInicio!: Date;

    @Column()
    dataFim!: Date;

    @Column()
    idProduto!: number;

    @ManyToOne(() => Produtos, produto => produto.promocoes)
    @JoinColumn({ name: 'idProduto' })
    @JoinTable({ name: 'produtos' })
    produto!: Produtos;
}