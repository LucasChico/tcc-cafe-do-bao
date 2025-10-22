import { Router } from "express";
import { PedidoProduto } from "../entities/pedidoProdutos";
import { AppDataSource } from "../database/appDataSource";

const router = Router();

router.post('/:idPedido/pedidoProdutos', async (req, res) => {
    const idPedido = parseInt(req.params.idPedido);
    const pedidoProdutos = req.body as PedidoProduto[];
    const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
    const pedido = await pedidoProdutoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
        return res.status(404).json({ message: 'PedidoProduto não encontrado' });
    }

    pedidoProdutos.forEach((pedidoProduto) => {
        pedidoProduto.idPedido = idPedido;
        pedidoProdutoRepo.create(pedidoProduto);
    });

    await pedidoProdutoRepo.save(pedidoProdutos);
    res.json(pedidoProdutos);
});

router.get('/:idPedido/pedidoProdutos', async (req, res) => {
    const idPedido = parseInt(req.params.idPedido);
    const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
    const pedidoProdutos = await pedidoProdutoRepo.find({ where: { idPedido } });
    res.json(pedidoProdutos);
});

router.delete('/:idPedido/pedidoProdutos/:idProduto', async (req, res) => {
    const idPedido = parseInt(req.params.idPedido);

    const idProduto = parseInt(req.params.idProduto);
    const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
    await pedidoProdutoRepo.delete({ idPedido, idProduto });
    res.json({ message: 'PedidoProduto deletado com sucesso' });
});