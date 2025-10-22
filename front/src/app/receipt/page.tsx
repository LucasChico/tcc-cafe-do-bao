"use client";

import { Select } from "@/components/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReceiptScreen() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const router = useRouter();

  function handleEvaluate() {
    alert("Sua avaliação foi enviada!");
    router.push("home");
  }

  return (
    <div className="main-content neumorphic">
      <h2>Recibo</h2>
      <p>Pedido #3509 confirmado!</p>
      <h3>Avaliação</h3>

      <Select
        label="Endereço"
        options={[1, 2, 3, 4, 5].map((n) => ({
          value: n,
          label: `${n} - Estrelas`,
        }))}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full"
      />
      <textarea
        className="mt-2 w-full bg-white p-2 rounded-md border-1 min-h-[250px]"
        placeholder="Comentário"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button
        className="button-default w-full mt-6 text-lg font-semibold"
        onClick={handleEvaluate}
      >
        Enviar Avaliação
      </button>
    </div>
  );
}
