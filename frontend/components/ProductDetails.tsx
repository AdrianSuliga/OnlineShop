import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewList from './ReviewList';
import { Button,Col,Collapse,CollapseProps,Divider,Image, Row, Typography } from "antd";
import Product from './Product';
import PurchaseWindow from './PurchaseWindow';
const { Title, Text } = Typography;


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
  const [discount, setDiscount] = useState<number>(0);

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
    const fetchDiscount = async () => {
      try {
          const response = await fetch(`http://localhost:3000/productdata/${id}`);
          const data = await response.json();
          setDiscount( data["Discount"] || 1.0 );
      } catch (error) {
          console.error('Error fetching discount:', error);
      }
    };

    fetchProduct();
    fetchDiscount();
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
                {(discount == 1.0) ?
              <p> <strong>Cena:</strong> {product.price} zł </p>
            :
              <div>
            <div style={{ margin: "10px 0" }}>
                    <Text delete style={{ marginRight: 8 }}>
                      {product.price.toFixed(2)} zł
                    </Text>
                    <Text strong style={{ color: "red" }}>
                      {(product.price*discount).toFixed(2)} zł
                    </Text>
                  </div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 10, color: "red" }}>
                    Promocja: {((1-discount)*100).toFixed(0)}% taniej!
                  </Text>

                  </div>
            }
                
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
