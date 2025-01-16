import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewList from './ReviewList';
import { Button,Col,Collapse,CollapseProps,Divider,Image, Row } from "antd";
import Product from './Product';
import PurchaseWindow from './PurchaseWindow';

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
            const data = await response.json();
            setProduct(data); // Domyślnie ustawiamy `10`, jeśli `stock` nie jest dostępny
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
                <p style={{ marginTop:'20px'}}>
                    <strong>Cena:</strong> {product.price} PLN
                </p>
                
                <Divider />

                <PurchaseWindow productID={Number(id) | 0} />

                <Divider />

                <Collapse items={productData} defaultActiveKey={[]} />
            </Col>
        </Row>
    </div>
  );
};

export default ProductDetails;
