import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewList from './ReviewList';
import { Button,Col,Collapse,CollapseProps,Divider,Image, Row } from "antd";
import Product from './Product';

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

  const productData: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Opis Produktu',
      children: <p>{product.description}</p>,
    },
    {
      key: '2',
      label: 'Opinie',
      children: (
        <ReviewList productID={product.id} />
      ),
    },
  ];

  return (
    <div style={{ padding: '10px', margin: '10px' }}>
        
        <h2>{product.title}</h2>

        <Row gutter={24} align="top">
            {/* Kolumna obrazka */}
            <Col span={6} style={{ textAlign: 'center' }}>
            <Image
                src={product.image}
                alt={product.title}
                style={{ maxWidth: '100%', height: 'auto', alignItems:'center' }}
            />
            </Col>

            {/* Kolumna opisu */}
            <Col span={12}>
                <p>
                    <strong>Cena:</strong> {product.price} PLN
                </p>
                
                <Divider />

                <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <p><strong>Magazyn:</strong> {product.stock} dostepne</p>
                    <p><strong> Dodaj do koszyka: </strong></p>
                    <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{ width: '60px', marginRight: '10px' }}
                    />
                    <Button onClick={handleAddToCart} color='primary' variant='solid'>
                    Add to Cart
                    </Button>
                </div>

                <Divider />

                <Collapse items={productData} defaultActiveKey={[]} />
            </Col>
        </Row>
    </div>
  );
};

export default ProductDetails;
