// src/entities/Endereco.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cliente } from './cliente';

@Entity('endereco')
export class Endereco {
    @PrimaryGeneratedColumn()
    idEndereco!: number;

    @Column()
    cep!: string;

    @Column()
    bairro!: string;

    @Column()
    rua!: string;

    @Column()
    numero!: string;

    @Column({ nullable: true })
    complemento!: string;

    @Column()
    idCliente!: number;

    @ManyToOne(() => Cliente, cliente => cliente.enderecos)
    cliente!: Cliente;
}