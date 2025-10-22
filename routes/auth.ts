import { Router } from "express";
import { AppDataSource } from "../database/appDataSource";
import { Cliente } from "../entities/cliente";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router()

const JWT_SECRET = 'meu-secret-muito-secreto';

router.post('/register', async (req, res) => {
    const {
        nome,
        usuario,
        dataDeNascimento,
        documento,
        email,
        senha
    } = req.body;

    const clienteRepo = AppDataSource.getRepository(Cliente);

    const existingCliente = await clienteRepo.findOne({ where: { nomeDeUsuario: usuario } });
    if (existingCliente) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }



    const cliente = new Cliente();
    cliente.nome = nome;
    cliente.nomeDeUsuario = usuario;
    cliente.dataDeNascimento = dataDeNascimento;
    cliente.documento = documento;

    const hashedPassword = await bcrypt.hash(senha, 10);
    cliente.senha = hashedPassword;
    await clienteRepo.save(cliente);

    return res.status(201).json({ message: 'Registro realizado com sucesso' });
});

router.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    const clienteRepo = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepo.findOne({ where: { nomeDeUsuario: usuario } });
    if (!cliente) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(senha, cliente.senha);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: cliente.idCliente }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
});

export default router;