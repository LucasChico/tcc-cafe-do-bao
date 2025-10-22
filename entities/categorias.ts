import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produtos } from "./produtos";

@Entity('categorias')
export class Categorias {
    @PrimaryGeneratedColumn()
    idCategoria!: number;

    @Column()
    nome!: string;

    @Column()
    icone!: string;

    @OneToMany(() => Produtos, produto => produto.categoria)
    produtos!: Produtos[];
}