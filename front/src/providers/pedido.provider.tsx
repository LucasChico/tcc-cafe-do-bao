import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.provider";
import { useToast } from "./toast.provider";

const PedidoContext = createContext({
  pedido: null,
  setPedido: (s) => {},
  produtosDoPedido: [],
  setProdutosDoPedido: (s) => {},
  abrirCheckout: async () => {},
  adicionarProduto: async (s) => {},
  abrirPedido: async () => {},
});

export const usePedido = () => {
  return useContext(PedidoContext);
};

export const PedidoProvider = ({ children }) => {
  const { token, idCliente } = useAuth();
  const { addToast } = useToast();
  const [pedido, setPedido] = useState(null);
  const [produtosDoPedido, setProdutosDoPedido] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (!pedido) {
      obterPedidoEmAntamento();
    }
  }, []);

  const obterPedidoEmAntamento = async () => {
    const response = await fetch(
      `http://localhost:3000/pedidos?idCliente=${idCliente()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const payload = await response.json();

      if (payload.pedido) {
        setPedido(payload.pedido);
        setProdutosDoPedido(payload.pedido.pedido_produtos);
      }
    }
  };

  const abrirPedido = async () => {
    const response = await fetch("http://localhost:3000/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ idCliente: idCliente() }),
    });

    if (response.ok) {
      const pedido = await response.json();
      setPedido(pedido);
      return pedido;
    }

    const message = await response.json();
    addToast(message.message, "error");
  };

  const adicionarProduto = async (produto) => {
    let pedidoAtual = pedido;

    const response = await fetch(
      `http://localhost:3000/pedidos/${pedidoAtual.idPedido}/produtos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idProduto: produto.idProduto }),
      }
    );

    if (response.ok) {
      const produtos = await response.json();
      addToast("Produto adicionado ao carrinho.", "success");
      setProdutosDoPedido(produtos);
    }

    const message = await response.json();
    addToast(message.message, "error");
  };

  const abrirCheckout = async () => {
    if (!pedido) {
      addToast("Nenhum pedido aberto, adicione produtos ao carrinho.", "error");
    }

    const response = await fetch(
      `http://localhost:3000/pedidos/${pedido.idPedido}/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const pedido = await response.json();
      setPedido(pedido);
      setProdutosDoPedido(pedido.pedido_produtos);
      return pedido;
    }

    const message = await response.json();
    addToast(message.message, "error");
  };

  return (
    <PedidoContext.Provider
      value={{
        pedido,
        setPedido,
        produtosDoPedido,
        setProdutosDoPedido,
        abrirCheckout,
        adicionarProduto,
        abrirPedido,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
