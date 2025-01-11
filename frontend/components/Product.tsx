import React from 'react';
import { Link } from 'react-router-dom';

interface ProductType {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
  }

  interface ProductProps {
    product: ProductType;
  }
  
const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h2>{product.title}</h2>
      <p>{product.description.substring(0, 50)}...</p>
      <img src={product.image} alt={product.title} style={{ width: '100px' }} />
      <p><strong>Price:</strong> ${product.price}</p>
      <Link to={`/products/${product.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
        View Details
      </Link>
    </div>
  );
};

export default Product;