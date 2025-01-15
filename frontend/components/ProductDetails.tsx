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
  }

  // interface ProductProps {
  //   product: ProductType;
  // }
  
const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} style={{ width: '200px' }} />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <ReviewList productID={product.id} />    
      </div>
  );
};

export default ProductDetails;