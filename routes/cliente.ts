// src/routes/clienteRoutes.ts
import { Router } from 'express';   
import { Cliente } from '../entities/cliente';
import { AppDataSource } from '../database/appDataSource';

const router = Router();

router.put('/:idCliente', async (req, res) => {
    const clienteRepo = AppDataSource.getRepository(Cliente);
    const idCliente = parseInt(req.params.idCliente);

    try {
        const cliente = await clienteRepo.findOne({ where: { idCliente: idCliente } });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        Object.assign(cliente, req.body);
        await clienteRepo.save(cliente);
        res.json(cliente);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
});

router.get('/:idCliente', async (req, res) => {
    const clienteRepo = AppDataSource.getRepository(Cliente);
    const idCliente = parseInt(req.params.idCliente);

    try {
        const cliente = await clienteRepo.findOne({ where: { idCliente: idCliente } });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Erro desconhecido' });
    }
});

router.get('/', async (req, res) => {
    const clienteRepo = AppDataSource.getRepository(Cliente);
    const clientes = await clienteRepo.find();
    res.json(clientes);
});


export default router;