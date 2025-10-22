import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Endereco } from './endereco';
import { Pedido } from './pedido';
import { Cartao } from './cartao';

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn()
    idCliente!: number;

    @Column()
    nome!: string;

    @Column()
    senha!: string;

    @Column({ unique: true })
    nomeDeUsuario!: string;

    @Column({ nullable: true })
    dataDeNascimento!: Date;

    @Column({ nullable: true })
    documento!: string;

    @OneToMany(() => Endereco, endereco => endereco.cliente)
    enderecos!: Endereco[];

    @OneToMany(() => Pedido, pedido => pedido.cliente)
    pedidos!: Pedido[];

    @OneToMany(() => Cartao, cartao => cartao.cliente)
    cartoes!: Cartao[];
}