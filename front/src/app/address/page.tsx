"use client";

import { useAuth } from "@/providers/auth.provider";
import { useToast } from "@/providers/toast.provider";

const AddressScreen = () => {
  const { addToast } = useToast();
  const { token, idCliente } = useAuth();

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const [cep, bairro, rua, numero, complemento] = e.target.elements;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cep: cep.value,
        bairro: bairro.value,
        rua: rua.value,
        numero: numero.value,
        complemento: complemento.value,
        idCliente: idCliente(),
      }),
    });

    if (response.ok) {
      const address = await response.json();
      // setAddresses([...addresses, address]);
      addToast("Endereço cadastrado com sucesso!", "success");
      window.location.href = "/checkout";
      return;
    }

    const error = await response.json();
    addToast(error.message, "error");
  };

  return (
    <div className="main-content neumorphic">
      <h2>Cadastro de Endereço</h2>
      <form className="form" onSubmit={handleAddAddress}>
        <input type="text" placeholder="CEP" required />
        <input type="text" placeholder="Bairro" required />
        <input type="text" placeholder="Rua" required />
        <input type="text" placeholder="Número" required />
        <input type="text" placeholder="Complemento" />
        <button type="submit">Cadastrar</button>
        <button
          className="button-cancel"
          onClick={() => (window.location.href = "/checkout")}
        >
          Voltar
        </button>
      </form>
    </div>
  );
};

export default AddressScreen;
