import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { PedidoProduto } from './pedidoProdutos';
import { Promocao } from './promocao';
import { Categorias } from './categorias';

@Entity('produtos')
export class Produtos {
    @PrimaryGeneratedColumn()
    idProduto!: number;

    @Column()
    idCategoria!: number;

    @Column()
    nome!: string;

    @Column('float')
    precoFixo!: number;

    @Column()
    descricao!: string;

    @OneToMany(() => PedidoProduto, pedidoProdutos => pedidoProdutos.produto)
    pedido_produtos!: PedidoProduto[];

    @OneToMany(() => Promocao, promocao => promocao.produto)
    promocoes!: Promocao[];

    @ManyToOne(() => Categorias, categoria => categoria.produtos)
    @JoinTable({ name: 'categorias' })
    @JoinColumn({ name: 'idCategoria' })
    categoria!: Categorias; 
}