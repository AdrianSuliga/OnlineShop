import { Col, Collapse, CollapseProps, Row, Image, Divider, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PurchaseWindow from './PurchaseWindow';
const { Title, Text } = Typography;

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
  const navigate = useNavigate();
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchDiscount = async () => {
        try {
            const response = await fetch(`http://localhost:3000/productdata/${product.id}`);
            const data = await response.json();
            setDiscount( data["Discount"] || 0 );
        } catch (error) {
            console.error('Error fetching discount:', error);
        }
    };

    fetchDiscount();
  }, []);

  const productData: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Szybkie Zakupy',
      children: <PurchaseWindow productID={product.id}/>
    },
    {
      key: '2',
      label: 'Opis Produktu',
      children: <p>{product.description}</p>,
    },
    {
      key: '3',
      label: 'Opinie',
      children: (
        <Link
          to={`/products/${product.id}`}
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Przejdź do strony produktu
        </Link>
      ),
    },
  ];

  return (
    <div className="gradientBackground" id="productBackground">
      <Divider />

      <Row gutter={24} align="top">
        {/* Kolumna obrazka */}
        <Col span={4} style={{ alignItems: 'center'}}>
          <Image
            src={product.image}
            alt={product.title}
            style={{    
              maxWidth: '100%',
              height: 'auto',
              alignItems:'center',
              color: 'white',
            }}
          />
        </Col>

        {/* Kolumna opisu */}
        <Col span={16}>
            <Link to={`/products/${product.id}`} style={{color:'#3f48cc'}}>
              <h2>{product.title}</h2>
            </Link>
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
          <Collapse items={productData} defaultActiveKey={[]} />
        </Col>
      </Row>

      <Divider />
    </div>
  );
};

export default Product;
