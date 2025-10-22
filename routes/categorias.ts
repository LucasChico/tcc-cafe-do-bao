import { Router } from "express";
import { AppDataSource } from "../database/appDataSource";
import { Categorias } from "../entities/categorias";
import { Produtos } from "../entities/produtos";

const router = Router();

router.get('/', async (req, res) => {
    const categoriasRepo = AppDataSource.getRepository(Categorias);
    const categorias = await categoriasRepo.find();
    res.json(categorias);
});


router.post('/', async (req, res) => {
    const categoriasRepo = AppDataSource.getRepository(Categorias);
    const categoria = req.body;
    await categoriasRepo.save(categoria);
    res.json(categoria);
});

router.get('/:idCategoria', async (req, res) => {
    const categoriasRepo = AppDataSource.getRepository(Categorias);
    const categoria = await categoriasRepo.findOne({ where: { idCategoria: parseInt(req.params.idCategoria) } });

    if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    const produtos = await AppDataSource.getRepository(Produtos).find({ where: { categoria: categoria } });
    categoria!.produtos = produtos;
    res.json(categoria);
});


export default router;