import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/appDataSource";
import { Pedido } from "../entities/pedido";
import { PedidoProduto } from "../entities/pedidoProdutos";
import { Produtos } from "../entities/produtos";
import { In, Not } from "typeorm";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const idCliente = req.body.idCliente;
  const pedidoRepo = AppDataSource.getRepository(Pedido);

  let pedido = await pedidoRepo.findOne({
    where: { idCliente, status: "checkout" },
  });
  if (pedido) {
    const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
    const pedidoProdutos = await pedidoProdutoRepo.find({
      where: { idPedido: pedido.idPedido },
    });
    pedido.pedido_produtos = pedidoProdutos;
    return res.status(200).json(pedido);
  }

  pedido = await pedidoRepo.findOne({ where: { idCliente, status: "aberto" } });
  if (pedido) {
    return res.status(200).json(pedido);
  }

  pedido = {} as Pedido;

  try {
    pedido.idCliente = idCliente;
    pedido.dataPedido = new Date();
    pedido.status = "aberto";
    const newPedido = pedidoRepo.create(pedido);
    await pedidoRepo.save(newPedido);
    res.json(newPedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/:idPedido/produtos", async (req: Request, res: Response) => {
  const idPedido = parseInt(req.params.idPedido);
  const idProduto = parseInt(req.body.idProduto);

  const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const pedido = await pedidoRepo.findOne({ where: { idPedido } });

  const existingPedidoProduto = await pedidoProdutoRepo.findOne({
    where: { idPedido, idProduto },
  });
  if (existingPedidoProduto && pedido!.status === "aberto") {
    existingPedidoProduto.quantidade += 1;
    await pedidoProdutoRepo.save(existingPedidoProduto);
  }

  if (!existingPedidoProduto) {
    const newPedidoProduto = {} as PedidoProduto;
    newPedidoProduto.idPedido = idPedido;
    newPedidoProduto.idProduto = idProduto;
    newPedidoProduto.quantidade = 1;

    await pedidoProdutoRepo.save(newPedidoProduto);
  }

  const produtos = await pedidoProdutoRepo.find({ where: { idPedido } });
  res.json(produtos);
});

router.put("/:idPedido/enviar_cozinha", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    pedido.status = "em_preparo";
    await pedidoRepo.save(pedido);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.put("/:idPedido/enviar_entrega", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    pedido.status = "saiu_para_entrega";
    await pedidoRepo.save(pedido);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/:idPedido/comanda", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido || pedido.status !== "aberto") {
      return res
        .status(404)
        .json({ message: "Pedido não disponível para comanda" });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const { idCliente } = req.query;

  try {
    const pedido = await pedidoRepo.findOne({
      where: {
        idCliente: +(idCliente || "0"),
        status: Not(
          In(["em_preparo", "saiu_para_entrega", "entregue", "cancelado"])
        ),
      },
    });

    if (!!pedido) {
      await obterProdutosDoPedido(pedido);
    }
    res.json({ pedido: pedido });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.delete("/:idPedido", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido || pedido.status === "saiu_para_entrega") {
      return res.status(400).json({ message: "Pedido não pode ser cancelado" });
    }
    await pedidoRepo.delete(idPedido);
    res.json({ message: "Pedido cancelado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.put("/:idPedido/status", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);
  const { status } = req.body;

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    if (!["recebido", "em_preparo", "saiu_para_entrega"].includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }
    pedido.status = status;
    await pedidoRepo.save(pedido);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/:idPedido/checkout", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    if (pedido?.status === "checkout") {
      pedido.pedido_produtos = await obterProdutosDoPedido(pedido);
      return res.status(200).json(pedido);
    }

    if (pedido.status !== "aberto") {
      return res
        .status(400)
        .json({ message: "Pedido não pode ser checkoutado" });
    }

    pedido.status = "checkout";
    await pedidoRepo.save(pedido);

    pedido.pedido_produtos = await obterProdutosDoPedido(pedido);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.patch("/:idPedido/endereco", async (req, res) => {
  const pedidoRepo = AppDataSource.getRepository(Pedido);
  const idPedido = parseInt(req.params.idPedido);
  const { idEndereco } = req.body;

  try {
    const pedido = await pedidoRepo.findOne({ where: { idPedido } });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    pedido.idEndereco = idEndereco;
    await pedidoRepo.save(pedido);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

async function obterProdutosDoPedido(pedido: Pedido) {
  const pedidoProdutoRepo = AppDataSource.getRepository(PedidoProduto);
  const produtoRepo = AppDataSource.getRepository(Produtos);

  const pedidoProdutos = await pedidoProdutoRepo.find({
    where: { idPedido: pedido.idPedido },
  });
  const produtos = await produtoRepo.find({
    where: { idProduto: In(pedidoProdutos.map((p) => p.idProduto)) },
  });

  pedidoProdutos.forEach(
    (pp) => (pp.produto = produtos.find((p) => p.idProduto === pp.idProduto)!)
  );
  pedido.pedido_produtos = pedidoProdutos;
  return pedidoProdutos;
}

export default router;
