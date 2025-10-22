"use client";

import { Select } from "@/components/select";
import { useAuth } from "@/providers/auth.provider";
import { usePedido } from "@/providers/pedido.provider";
import { Piedra } from "next/font/google";
import { useEffect, useState } from "react";

const CheckoutScreen = () => {
  const { produtosDoPedido, pedido } = usePedido();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { token } = useAuth();
  const currentDate = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

  useEffect(() => {
    fetch(`${process.env.API_URL}/enderecos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((addresses) => {
        setAddresses(addresses);
        setSelectedAddress(addresses[0].idEndereco);
      });
  }, []);

  useEffect(() => {
    if (!pedido) {
      return;
    }

    if (pedido.status !== "checkout") {
      window.location.pathname = "home";
    }

    if (selectedAddress) {
      console.log("vai cair aqui dentro um dia?");

      fetch(`${process.env.API_URL}/pedidos/${pedido.idPedido}/endereco`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idEndereco: selectedAddress }),
      });
    }
  }, [selectedAddress, pedido]);

  const handleFinalizarPedido = () => {
    if (!selectedAddress) {
      alert("você não selecionou nenhum endereço");
      return;
    }

    window.location.href = "payment";
  };
  return (
    <div className="main-content neumorphic">
      <div className="invoice">
        <h2>Comanda</h2>
        <div className="invoice-header">
          <p>
            <strong>Café do Bão</strong>
          </p>
          <p>Data/Hora: {currentDate}</p>
          <p>CPF/CNPJ: 12.345.678/0001-90</p>
        </div>
        <ul className="invoice-items">
          {produtosDoPedido?.map((item, idx) => (
            <li key={idx}>
              <b>
                {item.quantidade}x {item.produto.nome}
              </b>{" "}
              - R$ {item.produto.precoFixo.toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="invoice-address">
          <Select
            label="Endereço"
            options={addresses.map((addr) => ({
              value: addr.idEndereco,
              label: `${addr.rua}, ${addr.numero}`,
            }))}
            value={selectedAddress}
            onChange={setSelectedAddress}
            disabled={addresses.length === 0}
            className="w-full"
          />
          <button
            className="button-transparent"
            onClick={() => (window.location.href = "/address")}
          >
            Adicionar Endereço
          </button>
        </div>
        <div className="invoice-footer">
          <p>
            Total: R${" "}
            {produtosDoPedido
              ?.reduce((sum, p) => sum + p.produto.precoFixo * p.quantidade, 0)
              .toFixed(2)}
          </p>
          <small>* Valores sujeitos a confirmação no pagamento.</small>
        </div>
        <button
          className="button-green"
          onClick={() => handleFinalizarPedido()}
        >
          Finalizar Pedido
        </button>
        <button
          className="button-transparent"
          onClick={() => (window.location.href = "home")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default CheckoutScreen;
