"use client";

import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { usePedido } from "@/providers/pedido.provider";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const {
    pedido,
    produtosDoPedido,
    adicionarProduto,
    abrirCheckout,
    abrirPedido,
  } = usePedido();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`${process.env.API_URL}/categorias/${selectedCategory}/produtos`)
        .then((res) => res.json())
        .then(setProducts);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetch(`${process.env.API_URL}/categorias`)
      .then((res) => res.json())
      .then((categories) => {
        setCategories(categories);
        setSelectedCategory(categories[0].idCategoria);
      });
  }, []);

  const handleAbrirPedido = async () => {
    await abrirPedido();
  };

  const handleAddToCart = (product) => {
    adicionarProduto(product);
  };

  const handleCheckout = async () => {
    await abrirCheckout();
    window.location.href = "/checkout";
  };

  const getQuantidade = (idProduto) => {
    const item = produtosDoPedido.find((p) => p.idProduto === idProduto);
    return item ? item.quantidade : 0;
  };

  return !pedido ? (
    <div className="main-content neumorphic login-container">
      <h2 className="text-xl">Você não tem um pedido em andamento</h2>
      <button
        className="button-default checkout-button"
        onClick={handleAbrirPedido}
      >
        clique aqui para iniciar um pedido
      </button>
    </div>
  ) : (
    <div className="main-content neumorphic home-content">
      <h2 className="text-xl">Categorias</h2>
      <div className="categories">
        {categories.map((category) => (
          <CategoryCard
            key={category.idCategoria}
            category={category}
            onClick={() => setSelectedCategory(category.idCategoria)}
          />
        ))}
      </div>
      <h2 className="text-xl">Produtos</h2>
      <div className="products">
        {products.map((product) => {
          const quantidade = getQuantidade(product.idProduto);
          return (
            <div key={product.idProduto} className="product-with-qty">
              <ProductCard
                product={product}
                onClick={() => handleAddToCart(product)}
              />
              <p className="text-sm text-gray-600 mt-1">
                Quantidade: {quantidade}
              </p>
            </div>
          );
        })}
        {products.length === 0 && <p>Nenhum produto encontrado</p>}
      </div>
      <button
        className="button-default checkout-button"
        onClick={handleCheckout}
      >
        Ir para Checkout
      </button>
    </div>
  );
};

export default HomeScreen;
