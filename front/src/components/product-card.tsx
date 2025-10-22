export const ProductCard = ({ product, onClick }) => {
    return (
        <div className="product-card neumorphic">
            <div className="product-card-info">
                <h3>{product.nome}</h3>
                <p>R$ {product.precoFixo.toFixed(2)}</p>
                <p className="product-card-description">{product.descricao}</p>
            </div>
            <div className="product-card-button" onClick={onClick}>
                <img src={'/icons/carrinho-de-compras.png'} alt="Adicionar ao Carrinho" draggable={false} />
                <p>Adicionar ao Carrinho</p>
            </div>
        </div>
    );
}