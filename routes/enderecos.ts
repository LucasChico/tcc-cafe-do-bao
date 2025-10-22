// src/routes/enderecoRoutes.ts
import { Router } from 'express';
import { Endereco } from '../entities/endereco';
import { Cliente } from '../entities/cliente';
import { AppDataSource } from '../database/appDataSource';

const router = Router();

router.post('/', async (req, res) => {
    const enderecoRepo = AppDataSource.getRepository(Endereco);
    const endereco = req.body;

    const cep = endereco.cep.replace(/\D/g, '');

    const enderecoExistente = await enderecoRepo.findOne({ where: { cep: cep, idCliente: req.body.idCliente } });
    endereco.cep = cep;
    if (enderecoExistente) {
        return res.status(400).json({ message: 'Endereço já cadastrado' });
    }

    try {
        const newEndereco = enderecoRepo.create(endereco);
        await enderecoRepo.save(newEndereco);
        res.json(newEndereco);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});


router.get('/', async (req, res) => {
    const enderecoRepo = AppDataSource.getRepository(Endereco);
    const enderecos = await enderecoRepo.find({
        where: {
            idCliente: req.body.idCliente
        }
    });
    res.json(enderecos);
});

router.delete('/:idEndereco', async (req, res) => {
    const idEndereco = parseInt((req.params as unknown as { idEndereco: string }).idEndereco);
    const enderecoRepo = AppDataSource.getRepository(Endereco);
    await enderecoRepo.delete(idEndereco);
    res.json({ message: 'Endereço deletado com sucesso' });
});


export default router;