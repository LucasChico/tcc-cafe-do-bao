export const CategoryCard = ({ category, onClick }) => {
    return (
        <div className="category-card" onClick={onClick}>
            <img src={category.icone} alt={category.nome} draggable={false} />
            <h3>{category.nome}</h3>
        </div>
    );
}