// src/routes/produtoRoutes.ts
import { Router } from 'express';
import { Like, Raw } from 'typeorm';
import { Produtos } from '../entities/produtos';
import { AppDataSource } from '../database/appDataSource';

const router = Router();

router.get('/:idCategoria/produtos', async (req, res) => {
    const idCategoria = parseInt(req.params.idCategoria);

    const produtoRepo = AppDataSource.getRepository(Produtos);
    const q = req.query.q as string || '';
    try {
        const produtos = await produtoRepo.find({
            where: {
                idCategoria: idCategoria,
                nome: Raw(alias => `${alias} LIKE '%${q.toLowerCase()}%'`)
            }
        });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

router.post('/:idCategoria/produtos', async (req, res) => {
    const idCategoria = parseInt(req.params.idCategoria);

    const produtoRepo = AppDataSource.getRepository(Produtos);
    const produto = req.body;
    produto.idCategoria = idCategoria;
    const newProduto = produtoRepo.create(produto);
    await produtoRepo.save(newProduto);
    res.json(newProduto);
});

router.delete('/:idCategoria/produtos/:idProduto', async (req, res) => {
    const idCategoria = parseInt(req.params.idCategoria);
    const idProduto = parseInt(req.params.idProduto);

    const produtoRepo = AppDataSource.getRepository(Produtos);
    const produto = await produtoRepo.findOne({
        where: {
            idCategoria: idCategoria,
            idProduto: idProduto
        }
    });
    
    await produtoRepo.delete(produto!);
    res.json(produto);
});

export default router;