"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
import { usePedido } from "@/providers/pedido.provider";

export default function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [changeNeeded, setChangeNeeded] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [useTwoCards, setUseTwoCards] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const router = useRouter();
  const { token } = useAuth();

  const { pedido, setPedido, setProdutosDoPedido } = usePedido();

  useEffect(() => {
    if (paymentMethod === "pix") {
      setQrCode(Math.random().toString(36).substring(2, 15));
    }
  }, [paymentMethod]);

  const validateFields = () => {
    if (paymentMethod === "dinheiro") {
      if (changeNeeded && (!paymentAmount || paymentAmount <= 0)) {
        alert("Informe o valor para troco.");
        return false;
      }
    }

    if (paymentMethod === "cartao") {
      if (!cardName.trim()) {
        alert("Preencha o nome no cartão.");
        return false;
      }
      if (!cardNumber.trim() || cardNumber.length < 16) {
        alert("Número do cartão inválido.");
        return false;
      }
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert("Validade inválida. Use o formato MM/AA.");
        return false;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        alert("CVV inválido.");
        return false;
      }
    }

    if (paymentMethod === "selecionar") {
      alert("Selecione um método de pagamento.");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateFields()) return;

    if (paymentMethod === "pix") {
      setQrCode(Math.random().toString(36).substring(2, 15));
    }

    fetch(`http://localhost:3000/pedidos/${pedido.idPedido}/enviar_entrega`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setPedido(null);
        setProdutosDoPedido([]);
        router.push("/receipt");
      })
      .catch((err) => {
        alert("Falha ao realizar o pagamento.");
      });
  };

  return (
    <div className="main-content neumorphic flex flex-col gap-8 items-center justify-center max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-semibold text-primary">Pagamento</h2>

      <div className="w-full flex flex-col gap-4">
        <label className="form-label text-left">Método de Pagamento</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="form-select"
        >
          <option value="selecionar">Selecione</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
        </select>

        {paymentMethod === "dinheiro" && (
          <div className="mt-4 flex flex-col gap-3 text-left">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={changeNeeded}
                onChange={(e) => setChangeNeeded(e.target.checked)}
                className="w-4 h-4 accent-[#D08D48]"
              />
              Precisa de troco?
            </label>

            {changeNeeded && (
              <input
                type="number"
                placeholder="Valor para troco"
                className="px-4 py-2"
                value={paymentAmount || ""}
                onChange={(e) => setPaymentAmount(+e.target.value)}
              />
            )}
          </div>
        )}

        {paymentMethod === "cartao" && (
          <div className="mt-4 flex flex-col gap-3 text-left form">
            <div className="bg-tertiary rounded-xl flex flex-col gap-4 mt-2">
              <h3 className="text-primary font-semibold mb-2">
                Dados do Cartão
              </h3>

              <div className="flex flex-col gap-2">
                <label className="form-label">Nome impresso no cartão</label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  className="px-4 py-2"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Número do cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="px-4 py-2"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="form-label">Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    className="px-4 py-2"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    className="px-4 py-2"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "pix" && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="bg-white border border-dashed border-primary rounded-lg p-6 w-full flex flex-col items-center">
              <p className="font-medium text-primary">QR Code</p>
              <p className="text-sm text-gray-600 mt-1">
                {qrCode || "Gerando..."}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        className="button-default w-full mt-6 text-lg font-semibold"
      >
        Finalizar Pagamento
      </button>
    </div>
  );
}
