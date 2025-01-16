import { Col, Collapse, CollapseProps, Row, Image } from 'antd';
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
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <Row gutter={24} align="top">
        {/* Kolumna obrazka */}
        <Col span={4} style={{ textAlign: 'center' }}>
          <Image
            src={product.image}
            alt={product.title}
            style={{ maxWidth: '100%', height: 'auto', alignItems:'center' }}
          />
        </Col>

        {/* Kolumna opisu */}
        <Col span={16}>
          <h2>{product.title}</h2>
          <p>
            <strong>Cena:</strong> {product.price} PLN
          </p>
          <Collapse items={productData} defaultActiveKey={[]} />
        </Col>
      </Row>
    </div>
  );
};

export default Product;
