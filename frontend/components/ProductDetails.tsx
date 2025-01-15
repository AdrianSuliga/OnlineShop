import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewList from './ReviewList';

interface ProductType {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    stock: number
}

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Ilość do dodania do koszyka

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`);
            const response2 = await fetch(`http://localhost:3000/stocklevel/${id}`);
            const data = await response.json();
            const data2 = await response2.json();
            alert(JSON.stringify(data2[0]))
            setProduct({ ...data, stock: data2["StockLevel"] || 10 }); // Domyślnie ustawiamy `10`, jeśli `stock` nie jest dostępny
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (quantity > product.stock) {
        alert('Not enough items in stock!');
      } else {
        alert(`Added ${quantity} item(s) to the cart.`);
        setProduct({ ...product, stock: product.stock-quantity });

        // Tutaj możesz dodać logikę wysyłania danych do koszyka
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;


  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} style={{ width: '200px' }} />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock} available</p> {/* Wyświetlanie liczby dostępnych sztuk */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '60px', marginRight: '10px' }}
        />
        <button onClick={handleAddToCart} style={{ padding: '10px 20px' }}>
          Add to Cart
        </button>
      </div>
      <ReviewList productID={product.id} />
    </div>
  );
};

export default ProductDetails;
